// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
// Vencimiento del token
// ========================================
{
   process.env.CADUDAD_TOKEN = 60 * 60 * 24 * 30;
}

// ========================================
// SEED de Autenticacion
// ========================================

process.env.SEED  = process.env.SEED  || 'este-es-el-seed-desarrollo';

// ========================================
// Base de datos
// ========================================
let urlDB;

if (process.env.NODE_ENV ==='dev'){
    urlDB ='mongodb://localhost:27017/cafe';    
} else{
    urlDB =process.env.MONGO_URI;
}
// urlDB ='mongodb://cafeuser:abc123456@ds231723.mlab.com:31723/cafe';
process.env.URLDB = urlDB;

// ========================================
// Google CLIENT ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '99182205801-aenhsp72b4tdjgrhe2eulrn7s11f88bo.apps.googleusercontent.com';
