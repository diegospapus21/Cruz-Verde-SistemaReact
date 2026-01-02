require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado exitosamente');

    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ email: 'admin@cruzverde.org' });
    
    if (adminExists) {
      console.log('⚠️  El administrador ya existe');
      console.log('📧 Email: admin@cruzverde.org');
      console.log('🔑 Password: admin123');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Crear admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@cruzverde.org',
      password: 'admin123',
      role: 'admin',
      active: true
    });

    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();