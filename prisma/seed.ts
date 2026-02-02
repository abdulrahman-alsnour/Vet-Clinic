import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user with strong encryption
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@eaglesvet.com' },
    update: {},
    create: {
      email: 'admin@eaglesvet.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user created!');
  console.log('Email: admin@eaglesvet.com');
  console.log('Password: admin123');

  // Main Categories - Pets
  const categories = [
    // Dogs
    { name: 'Dog Food & Treats', slug: 'dog-food-treats' },
    { name: 'Dog Accessories', slug: 'dog-accessories' },
    { name: 'Dog Toys', slug: 'dog-toys' },
    { name: 'Dog Grooming', slug: 'dog-grooming' },
    { name: 'Dog Health', slug: 'dog-health' },
    
    // Cats
    { name: 'Cat Food & Treats', slug: 'cat-food-treats' },
    { name: 'Cat Accessories', slug: 'cat-accessories' },
    { name: 'Cat Toys', slug: 'cat-toys' },
    { name: 'Cat Grooming', slug: 'cat-grooming' },
    { name: 'Cat Health', slug: 'cat-health' },
    
    // Birds
    { name: 'Bird Food & Treats', slug: 'bird-food-treats' },
    { name: 'Bird Accessories', slug: 'bird-accessories' },
    { name: 'Bird Toys', slug: 'bird-toys' },
    { name: 'Bird Health', slug: 'bird-health' },
    
    // Fish & Aquatic
    { name: 'Fish Food', slug: 'fish-food' },
    { name: 'Fish Equipment', slug: 'fish-equipment' },
    { name: 'Fish Decorations', slug: 'fish-decorations' },
    
    // Small Animals
    { name: 'Small Animal Food', slug: 'small-animal-food' },
    { name: 'Small Animal Accessories', slug: 'small-animal-accessories' },
    { name: 'Small Animal Health', slug: 'small-animal-health' },
    
    // Reptiles
    { name: 'Reptile Food', slug: 'reptile-food' },
    { name: 'Reptile Habitat', slug: 'reptile-habitat' },
    { name: 'Reptile Health', slug: 'reptile-health' },
    
    // General
    { name: 'General Grooming', slug: 'general-grooming' },
    { name: 'General Health', slug: 'general-health' },
    { name: 'Housing & Furniture', slug: 'housing-furniture' },
    { name: 'Cleaning & Maintenance', slug: 'cleaning-maintenance' },
  ];

  // Create categories and store them
  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  console.log('Categories created!');
  console.log(`Total: ${createdCategories.length} categories`);

  // Sample products (prices in JOD - Jordanian Dinar)
  const products = [
    // Dog Food & Treats
    {
      name: 'Premium Dry Dog Food 15kg',
      slug: 'premium-dry-dog-food-15kg',
      description: 'High-quality dry dog food with natural ingredients. Perfect for adult dogs. Contains essential vitamins and minerals for optimal health.',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500',
      stock: 50,
      categoryId: createdCategories.find(c => c.slug === 'dog-food-treats')?.id || '',
    },
    {
      name: 'Puppy Wet Food Pack 12x400g',
      slug: 'puppy-wet-food-pack',
      description: 'Delicious wet food specially formulated for puppies. Rich in protein and nutrients to support healthy growth and development.',
      price: 20.00,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500',
      stock: 30,
      categoryId: createdCategories.find(c => c.slug === 'dog-food-treats')?.id || '',
    },
    
    // Dog Accessories
    {
      name: 'Retractable Dog Leash 5m',
      slug: 'retractable-dog-leash-5m',
      description: 'Heavy-duty retractable dog leash with comfortable grip handle. Suitable for medium and large dogs up to 50kg.',
      price: 11.50,
      image: 'https://images.unsplash.com/photo-1556909114-514e43b27fdc?w=500',
      stock: 100,
      categoryId: createdCategories.find(c => c.slug === 'dog-accessories')?.id || '',
    },
    {
      name: 'Dog Collar with Name Tag',
      slug: 'dog-collar-name-tag',
      description: 'Durable nylon dog collar with personalized name tag. Adjustable sizing for dogs of all sizes. Available in multiple colors.',
      price: 9.00,
      image: 'https://images.unsplash.com/photo-1594359514123-9bee0e09f208?w=500',
      stock: 75,
      categoryId: createdCategories.find(c => c.slug === 'dog-accessories')?.id || '',
    },
    
    // Cat Food & Treats
    {
      name: 'Indoor Cat Dry Food 10kg',
      slug: 'indoor-cat-dry-food-10kg',
      description: 'Specially formulated dry food for indoor cats. Helps maintain healthy weight and reduces hairballs.',
      price: 29.00,
      image: 'https://images.unsplash.com/photo-1539683255143-73a6b838b106?w=500',
      stock: 40,
      categoryId: createdCategories.find(c => c.slug === 'cat-food-treats')?.id || '',
    },
    {
      name: 'Kitten Wet Food Variety Pack',
      slug: 'kitten-wet-food-variety',
      description: 'Tasty variety pack with different flavors to keep your kitten happy. Rich in protein for healthy development.',
      price: 17.50,
      image: 'https://images.unsplash.com/photo-1596363500280-32828fefbbc0?w=500',
      stock: 35,
      categoryId: createdCategories.find(c => c.slug === 'cat-food-treats')?.id || '',
    },
    
    // Cat Accessories
    {
      name: 'Cat Scratching Post Tree',
      slug: 'cat-scratching-post-tree',
      description: 'Multi-level cat scratching post with integrated toys. Includes cozy hammock and multiple scratching surfaces.',
      price: 46.00,
      image: 'https://images.unsplash.com/photo-1475358401842-6fdac2365a6c?w=500',
      stock: 20,
      categoryId: createdCategories.find(c => c.slug === 'cat-accessories')?.id || '',
    },
    {
      name: 'Cat Litter Box with Hood',
      slug: 'cat-litter-box-hood',
      description: 'Odor-control litter box with removable hood and entrance flap. Easy to clean and maintain.',
      price: 13.50,
      image: 'https://images.unsplash.com/photo-1601934382025-c3e2c4cce619?w=500',
      stock: 25,
      categoryId: createdCategories.find(c => c.slug === 'cat-accessories')?.id || '',
    },
    
    // Bird Food & Treats
    {
      name: 'Budgie Seed Mix 1kg',
      slug: 'budgie-seed-mix-1kg',
      description: 'Premium seed mix for budgies and small parakeets. Rich in essential nutrients and vitamins.',
      price: 6.00,
      image: 'https://images.unsplash.com/photo-1594359514123-9bee0e09f208?w=500',
      stock: 60,
      categoryId: createdCategories.find(c => c.slug === 'bird-food-treats')?.id || '',
    },
    
    // Fish Food
    {
      name: 'Tropical Fish Flakes 500ml',
      slug: 'tropical-fish-flakes-500ml',
      description: 'Nutritional fish flakes for tropical freshwater fish. Enhances color and supports healthy growth.',
      price: 5.00,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
      stock: 45,
      categoryId: createdCategories.find(c => c.slug === 'fish-food')?.id || '',
    },
  ];

  // Create products
  for (const product of products) {
    if (product.categoryId) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      });
    }
  }

  console.log('Products created!');
  console.log(`Total: ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
