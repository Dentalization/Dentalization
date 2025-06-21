// Vector Database Configuration
// Supports Pinecone (managed), Qdrant (self-hosted), and Weaviate (self-hosted)

import { PineconeClient } from '@pinecone-database/pinecone';

// =====================================
// INTERFACES
// =====================================

export interface VectorRecord {
  id: string;
  values: number[];
  metadata: {
    patientId: string;
    dentistId: string;
    recordId: string;
    imageType: 'xray' | 'photo' | 'scan';
    fileName: string;
    uploadDate: string;
    description?: string;
    anatomicalRegion?: string;
    diagnosis?: string;
    findings?: string;
  };
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: VectorRecord['metadata'];
}

export interface VectorDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  upsert(records: VectorRecord[]): Promise<void>;
  search(vector: number[], topK?: number, filter?: Record<string, any>): Promise<SearchResult[]>;
  delete(ids: string[]): Promise<void>;
  getStats(): Promise<any>;
}

// =====================================
// PINECONE IMPLEMENTATION
// =====================================

export class PineconeVectorDB implements VectorDatabase {
  private client: PineconeClient;
  private indexName: string;
  private index: any;

  constructor() {
    this.client = new PineconeClient();
    this.indexName = process.env.PINECONE_INDEX || 'dental-images';
  }

  async connect(): Promise<void> {
    try {
      await this.client.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!
      });
      
      this.index = this.client.Index(this.indexName);
      console.log('✅ Pinecone connected successfully');
    } catch (error) {
      console.error('❌ Pinecone connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // Pinecone client doesn't require explicit disconnection
    console.log('✅ Pinecone disconnected');
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    try {
      await this.index.upsert({
        upsertRequest: {
          vectors: records.map(record => ({
            id: record.id,
            values: record.values,
            metadata: record.metadata
          }))
        }
      });
      console.log(`✅ Upserted ${records.length} vectors to Pinecone`);
    } catch (error) {
      console.error('❌ Pinecone upsert failed:', error);
      throw error;
    }
  }

  async search(vector: number[], topK: number = 10, filter?: Record<string, any>): Promise<SearchResult[]> {
    try {
      const queryRequest: any = {
        vector,
        topK,
        includeMetadata: true
      };

      if (filter) {
        queryRequest.filter = filter;
      }

      const response = await this.index.query({ queryRequest });
      
      return response.matches?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata
      })) || [];
    } catch (error) {
      console.error('❌ Pinecone search failed:', error);
      throw error;
    }
  }

  async delete(ids: string[]): Promise<void> {
    try {
      await this.index.delete1({
        ids
      });
      console.log(`✅ Deleted ${ids.length} vectors from Pinecone`);
    } catch (error) {
      console.error('❌ Pinecone delete failed:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('❌ Pinecone stats failed:', error);
      throw error;
    }
  }
}

// =====================================
// QDRANT IMPLEMENTATION
// =====================================

export class QdrantVectorDB implements VectorDatabase {
  private baseUrl: string;
  private apiKey?: string;
  private collectionName: string = 'dental_images';

  constructor() {
    this.baseUrl = process.env.QDRANT_URL || 'http://localhost:6333';
    this.apiKey = process.env.QDRANT_API_KEY;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };

    if (this.apiKey) {
      headers['api-key'] = this.apiKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`Qdrant request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async connect(): Promise<void> {
    try {
      // Check if collection exists, create if not
      try {
        await this.request(`/collections/${this.collectionName}`);
        console.log('✅ Qdrant collection already exists');
      } catch {
        // Create collection
        await this.request(`/collections/${this.collectionName}`, {
          method: 'PUT',
          body: JSON.stringify({
            vectors: {
              size: 512, // Adjust based on your embedding model
              distance: 'Cosine'
            }
          })
        });
        console.log('✅ Qdrant collection created');
      }
      
      console.log('✅ Qdrant connected successfully');
    } catch (error) {
      console.error('❌ Qdrant connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // Qdrant doesn't require explicit disconnection
    console.log('✅ Qdrant disconnected');
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    try {
      await this.request(`/collections/${this.collectionName}/points`, {
        method: 'PUT',
        body: JSON.stringify({
          points: records.map(record => ({
            id: record.id,
            vector: record.values,
            payload: record.metadata
          }))
        })
      });
      console.log(`✅ Upserted ${records.length} vectors to Qdrant`);
    } catch (error) {
      console.error('❌ Qdrant upsert failed:', error);
      throw error;
    }
  }

  async search(vector: number[], topK: number = 10, filter?: Record<string, any>): Promise<SearchResult[]> {
    try {
      const searchRequest: any = {
        vector,
        limit: topK,
        with_payload: true
      };

      if (filter) {
        searchRequest.filter = {
          must: Object.entries(filter).map(([key, value]) => ({
            key: key,
            match: { value }
          }))
        };
      }

      const response = await this.request(`/collections/${this.collectionName}/points/search`, {
        method: 'POST',
        body: JSON.stringify(searchRequest)
      });

      return response.result?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.payload
      })) || [];
    } catch (error) {
      console.error('❌ Qdrant search failed:', error);
      throw error;
    }
  }

  async delete(ids: string[]): Promise<void> {
    try {
      await this.request(`/collections/${this.collectionName}/points/delete`, {
        method: 'POST',
        body: JSON.stringify({
          points: ids
        })
      });
      console.log(`✅ Deleted ${ids.length} vectors from Qdrant`);
    } catch (error) {
      console.error('❌ Qdrant delete failed:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const stats = await this.request(`/collections/${this.collectionName}`);
      return stats.result;
    } catch (error) {
      console.error('❌ Qdrant stats failed:', error);
      throw error;
    }
  }
}

// =====================================
// VECTOR DATABASE FACTORY
// =====================================

export class VectorDBFactory {
  static create(type: 'pinecone' | 'qdrant' | 'weaviate' = 'pinecone'): VectorDatabase {
    switch (type) {
      case 'pinecone':
        return new PineconeVectorDB();
      case 'qdrant':
        return new QdrantVectorDB();
      case 'weaviate':
        throw new Error('Weaviate implementation not yet available');
      default:
        throw new Error(`Unknown vector database type: ${type}`);
    }
  }
}

// =====================================
// IMAGE EMBEDDING SERVICE
// =====================================

export class ImageEmbeddingService {
  private vectorDB: VectorDatabase;

  constructor(vectorDB: VectorDatabase) {
    this.vectorDB = vectorDB;
  }

  async generateEmbedding(imageBuffer: Buffer): Promise<number[]> {
    // This would typically use a model like CLIP or a specialized dental image model
    // For now, we'll return a placeholder embedding
    // In production, you'd use OpenAI's CLIP API or a custom model
    
    try {
      // Example with OpenAI (if using their multimodal API)
      if (process.env.OPENAI_API_KEY) {
        // Implementation would go here
        // For now, return a mock embedding
        return Array.from({ length: 512 }, () => Math.random());
      }
      
      // Fallback to mock embedding
      return Array.from({ length: 512 }, () => Math.random());
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      throw error;
    }
  }

  async storeImageEmbedding(
    imageBuffer: Buffer,
    metadata: Omit<VectorRecord['metadata'], 'uploadDate'>
  ): Promise<string> {
    try {
      const embedding = await this.generateEmbedding(imageBuffer);
      const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const record: VectorRecord = {
        id,
        values: embedding,
        metadata: {
          ...metadata,
          uploadDate: new Date().toISOString()
        }
      };

      await this.vectorDB.upsert([record]);
      console.log(`✅ Stored image embedding with ID: ${id}`);
      
      return id;
    } catch (error) {
      console.error('❌ Store image embedding failed:', error);
      throw error;
    }
  }

  async searchSimilarImages(
    queryImageBuffer: Buffer,
    options: {
      topK?: number;
      patientId?: string;
      imageType?: 'xray' | 'photo' | 'scan';
      anatomicalRegion?: string;
    } = {}
  ): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(queryImageBuffer);
      
      const filter: Record<string, any> = {};
      if (options.patientId) filter.patientId = options.patientId;
      if (options.imageType) filter.imageType = options.imageType;
      if (options.anatomicalRegion) filter.anatomicalRegion = options.anatomicalRegion;

      const results = await this.vectorDB.search(
        queryEmbedding,
        options.topK || 10,
        Object.keys(filter).length > 0 ? filter : undefined
      );

      console.log(`✅ Found ${results.length} similar images`);
      return results;
    } catch (error) {
      console.error('❌ Search similar images failed:', error);
      throw error;
    }
  }

  async deleteImageEmbedding(embeddingId: string): Promise<void> {
    try {
      await this.vectorDB.delete([embeddingId]);
      console.log(`✅ Deleted image embedding: ${embeddingId}`);
    } catch (error) {
      console.error('❌ Delete image embedding failed:', error);
      throw error;
    }
  }
}
