import { supabase } from './lib/supabase';
import dotenv from 'dotenv';
dotenv.config();

const createAdmin = async () => {
  const email = 'admin@signature8.com';
  const password = 'Password@123';

  console.log(`🚀 Creating admin user: ${email}...`);

  // Using service role key (implicitly via supabase client if configured)
  // Note: signUp normally requires confirmation, but with service role we can create verified users
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'super_admin' }
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Admin user already exists.');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  } else {
    console.log('✨ Admin user created successfully!');
    
    // Also ensure it's in the responsables table
    const { error: respError } = await supabase.from('responsables').upsert({
      nom: 'Administrateur',
      email,
      role: 'super_admin',
      actif: true
    }, { onConflict: 'email' });

    if (respError) console.error('Error updating responsables table:', respError);
  }
};

createAdmin();
