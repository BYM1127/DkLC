const { MongoClient } = require('mongodb');
const { setServers } = require('dns');

setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://rainbow11272005_db_user:sExSt0no7KO1b9YV@cluster1dimpho.jt5rd5s.mongodb.net/dimpho_ke_lesego_catering?retryWrites=true&w=majority&appName=Cluster1Dimpho';

const menuItems = [
  { name: 'Traditional Beef Stew', description: 'Slow-cooked beef stew with carrots and potatoes, served with pap.', price: 85, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80', isActive: true },
  { name: 'Grilled Quarter Chicken', description: 'Flame-grilled quarter chicken with our signature basting, served with a side of chakalaka.', price: 75, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', isActive: true },
  { name: 'Creamy Spinach & Butternut', description: 'Fresh spinach cooked in a creamy sauce, paired with roasted butternut.', price: 45, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1576021182211-9ea8dcb365ef?w=500&q=80', isActive: true },
  { name: 'Malva Pudding', description: 'Warm traditional South African dessert served with custard.', price: 55, category: 'Desserts', imageBase64: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=500&q=80', isActive: true },
  { name: 'Chakalaka', description: 'Spicy South African vegetable relish.', price: 35, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1563212001-f2f11edc5f59?w=500&q=80', isActive: true },
  { name: 'Boerewors Roll', description: 'Traditional South African sausage served in a roll with caramelized onions.', price: 65, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1627308595229-783087094d48?w=500&q=80', isActive: true },
  { name: 'Lamb Curry', description: 'Tender lamb pieces slow-cooked in aromatic spices.', price: 120, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80', isActive: true },
  { name: 'Braai Meat Platter', description: 'Assortment of grilled meats including chops, sausage, and ribs.', price: 180, category: 'Platters', imageBase64: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80', isActive: true },
  { name: 'Tripe (Mogodu)', description: 'Traditional South African tripe stew served with steamed bread (dombolo).', price: 95, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80', isActive: true },
  { name: 'Samp and Beans (Umngqusho)', description: 'Slow-cooked crushed corn and sugar beans.', price: 45, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80', isActive: true },
  { name: 'Mopane Worms', description: 'Fried mopane worms with onions and tomatoes.', price: 55, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=500&q=80', isActive: true },
  { name: 'Milk Tart', description: 'Classic South African dessert with a sweet pastry crust and creamy filling.', price: 45, category: 'Desserts', imageBase64: 'https://images.unsplash.com/photo-1579954115545-a95711e564bd?w=500&q=80', isActive: true },
  { name: 'Koeksisters', description: 'Crispy, braided dough infused with sweet syrup.', price: 40, category: 'Desserts', imageBase64: 'https://images.unsplash.com/photo-1551024506-0cb98424386e?w=500&q=80', isActive: true },
  { name: 'Vetkoek with Mince', description: 'Deep-fried dough filled with savory ground beef.', price: 65, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1560005701-a1523456c221?w=500&q=80', isActive: true },
  { name: 'Bobotie', description: 'Spiced minced meat baked with an egg-based topping, served with yellow rice.', price: 110, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80', isActive: true },
  { name: 'Bunny Chow', description: 'Hollowed-out loaf of bread filled with spicy chicken curry.', price: 90, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1506509653860-26410427daec?w=500&q=80', isActive: true },
  { name: 'Snoek Braai', description: 'Apricot-glazed snoek grilled over an open fire.', price: 130, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', isActive: true },
  { name: 'Chicken Feet (Runners)', description: 'Flavorful stewed chicken feet.', price: 40, category: 'Mains', imageBase64: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80', isActive: true },
  { name: 'Steamed Bread (Dombolo)', description: 'Soft, fluffy steamed bread, perfect for soaking up stews.', price: 30, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80', isActive: true },
  { name: 'Roasted Vegetables', description: 'Seasonal mixed vegetables roasted with herbs and olive oil.', price: 45, category: 'Sides', imageBase64: 'https://images.unsplash.com/photo-1590868153835-18db50f58cd2?w=500&q=80', isActive: true }
];

const galleryImages = [
  { eventName: 'Limpopo Traditional Wedding', description: 'Beautiful traditional setup with authentic dishes.', imageBase64: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80' },
  { eventName: 'Corporate Year-End Function', description: 'Elegant dining for an end of year corporate celebration.', imageBase64: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80' },
  { eventName: 'Family Reunion Picnic', description: 'Casual outdoor catering for a large family gathering.', imageBase64: 'https://images.unsplash.com/photo-1533143707019-ed4430bd1e43?w=800&q=80' },
  { eventName: 'Summer Garden Wedding', description: 'Romantic outdoor wedding with floral centerpieces.', imageBase64: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80' },
  { eventName: 'Gala Dinner', description: 'Formal dinner service with premium plated courses.', imageBase64: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80' },
  { eventName: 'Birthday Banquet', description: 'A lavish feast for a milestone 50th birthday.', imageBase64: 'https://images.unsplash.com/photo-1530103862676-de8892ebeea2?w=800&q=80' },
  { eventName: 'Intimate Bridal Shower', description: 'Delicate pastries and treats for a small bridal shower.', imageBase64: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { eventName: 'Rustic Barn Wedding', description: 'Hearty homestyle catering in a rustic venue.', imageBase64: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80' },
  { eventName: 'Executive Luncheon', description: 'Light, healthy corporate lunch service.', imageBase64: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80' },
  { eventName: 'Heritage Day Braai', description: 'Massive outdoor braai setup with various meats.', imageBase64: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
  { eventName: 'Engagement Party', description: 'Tapas and cocktail food for an evening engagement.', imageBase64: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80' },
  { eventName: 'Anniversary Dinner', description: 'Private fine dining experience for an anniversary.', imageBase64: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80' },
  { eventName: 'Product Launch Event', description: 'Modern, chic appetizers for a brand launch.', imageBase64: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' },
  { eventName: 'Festival Food Stall', description: 'Vibrant street-food style setup for a local festival.', imageBase64: 'https://images.unsplash.com/photo-1555244162-803834f80029?w=800&q=80' },
  { eventName: 'Baby Shower Brunch', description: 'Morning brunch with fruits, pastries and mimosas.', imageBase64: 'https://images.unsplash.com/photo-1484723091791-009ce0342398?w=800&q=80' },
  { eventName: 'Charity Fundraising Gala', description: 'Large scale catering for a charity event.', imageBase64: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80' },
  { eventName: 'Graduation Celebration', description: 'A massive celebratory feast for a recent graduate.', imageBase64: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80' },
  { eventName: 'Beachside Wedding', description: 'Fresh seafood and vibrant salads by the beach.', imageBase64: 'https://images.unsplash.com/photo-1533143707019-ed4430bd1e43?w=800&q=80' },
  { eventName: 'Wine Tasting Pairing', description: 'Gourmet bites designed to pair with local wines.', imageBase64: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80' },
  { eventName: 'Traditional Lobola', description: 'Traditional South African spread for a lobola negotiation.', imageBase64: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dimpho_ke_lesego_catering');
    
    await db.collection('menu_items').deleteMany({});
    
    let idCounter = 1;
    const mappedMenu = menuItems.map(item => ({
      ...item,
      id: idCounter++,
      createdAt: new Date()
    }));
    await db.collection('menu_items').insertMany(mappedMenu);
    
    let galleryIdCounter = 1;
    const mappedGallery = galleryImages.map(item => ({
      ...item,
      id: galleryIdCounter++,
      createdAt: new Date()
    }));
    await db.collection('gallery_images').deleteMany({});
    await db.collection('gallery_images').insertMany(mappedGallery);
    
    await db.collection('counters').updateOne({ _id: 'menu_items' }, { $set: { seq: idCounter } }, { upsert: true });
    await db.collection('counters').updateOne({ _id: 'gallery_images' }, { $set: { seq: galleryIdCounter } }, { upsert: true });

    console.log('Successfully seeded 20 menu items and 20 portfolio images!');
  } finally {
    await client.close();
  }
}

seed();
