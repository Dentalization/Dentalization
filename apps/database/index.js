"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = exports.AdminService = exports.DentistService = exports.PatientService = exports.UserService = exports.prisma = exports.PrismaClient = void 0;
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
// PostgreSQL-only database package for Dentalization
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
// Initialize and export Prisma client
var client_2 = require("@prisma/client");
var globalForPrisma = globalThis;
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_2.PrismaClient({
    log: ['query'],
});
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
// Export services (commented out for now due to type issues)
// export * from './services';
// Database health check
function checkDatabaseHealth() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('Database health check failed:', error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Database connection management
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.prisma.$connect()];
                case 1:
                    _a.sent();
                    console.log('✅ Database connected successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('❌ Database connection failed:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function disconnectDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.prisma.$disconnect()];
                case 1:
                    _a.sent();
                    console.log('✅ Database disconnected successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('❌ Database disconnection failed:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Export individual services
var user_service_1 = require("./services/user.service");
Object.defineProperty(exports, "UserService", { enumerable: true, get: function () { return user_service_1.UserService; } });
var patient_service_1 = require("./services/patient.service");
Object.defineProperty(exports, "PatientService", { enumerable: true, get: function () { return patient_service_1.PatientService; } });
var dentist_service_1 = require("./services/dentist.service");
Object.defineProperty(exports, "DentistService", { enumerable: true, get: function () { return dentist_service_1.DentistService; } });
var admin_service_1 = require("./services/admin.service");
Object.defineProperty(exports, "AdminService", { enumerable: true, get: function () { return admin_service_1.AdminService; } });
var appointment_service_1 = require("./services/appointment.service");
Object.defineProperty(exports, "AppointmentService", { enumerable: true, get: function () { return appointment_service_1.AppointmentService; } });
var templateObject_1;
// Temporarily commented out due to type issues
// export { DentalRecordService } from './services/dental-record.service';
// export { TreatmentService } from './services/treatment.service';
// export { PaymentService } from './services/payment.service';
