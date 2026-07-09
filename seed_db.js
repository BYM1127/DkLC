const { MongoClient } = require('mongodb');
const { setServers } = require('dns');

setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://rainbow11272005_db_user:sExSt0no7KO1b9YV@cluster1dimpho.jt5rd5s.mongodb.net/dimpho_ke_lesego_catering?retryWrites=true&w=majority&appName=Cluster1Dimpho';

const menuItems = [
  { name: 'Traditional Beef Stew', description: 'Slow-cooked beef stew with carrots and potatoes, served with pap.', price: 85, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Traditional%20Beef%20Stew%20South%20African%20cuisine?width=800&height=600&nologo=true', isActive: true },
  { name: 'Grilled Quarter Chicken', description: 'Flame-grilled quarter chicken with our signature basting, served with a side of chakalaka.', price: 75, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Grilled%20Quarter%20Chicken%20BBQ%20platter?width=800&height=600&nologo=true', isActive: true },
  { name: 'Creamy Spinach & Butternut', description: 'Fresh spinach cooked in a creamy sauce, paired with roasted butternut.', price: 45, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Creamy%20Spinach%20and%20Roasted%20Butternut%20side%20dish?width=800&height=600&nologo=true', isActive: true },
  { name: 'Malva Pudding', description: 'Warm traditional South African dessert served with custard.', price: 55, category: 'Desserts', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Malva%20Pudding%20with%20custard%20dessert?width=800&height=600&nologo=true', isActive: true },
  { name: 'Chakalaka', description: 'Spicy South African vegetable relish.', price: 35, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Chakalaka%20spicy%20vegetable%20relish?width=800&height=600&nologo=true', isActive: true },
  { name: 'Boerewors Roll', description: 'Traditional South African sausage served in a roll with caramelized onions.', price: 65, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Boerewors%20Roll%20sausage%20with%20onions?width=800&height=600&nologo=true', isActive: true },
  { name: 'Lamb Curry', description: 'Tender lamb pieces slow-cooked in aromatic spices.', price: 120, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20rich%20Lamb%20Curry%20in%20a%20bowl?width=800&height=600&nologo=true', isActive: true },
  { name: 'Braai Meat Platter', description: 'Assortment of grilled meats including chops, sausage, and ribs.', price: 180, category: 'Platters', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Braai%20Meat%20Platter%20grilled%20BBQ%20meats?width=800&height=600&nologo=true', isActive: true },
  { name: 'Tripe (Mogodu)', description: 'Traditional South African tripe stew served with steamed bread (dombolo).', price: 95, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20traditional%20Tripe%20stew%20Mogodu?width=800&height=600&nologo=true', isActive: true },
  { name: 'Samp and Beans (Umngqusho)', description: 'Slow-cooked crushed corn and sugar beans.', price: 45, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Samp%20and%20Beans%20Umngqusho?width=800&height=600&nologo=true', isActive: true },
  { name: 'Mopane Worms', description: 'Fried mopane worms with onions and tomatoes.', price: 55, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20fried%20Mopane%20Worms%20African%20delicacy?width=800&height=600&nologo=true', isActive: true },
  { name: 'Milk Tart', description: 'Classic South African dessert with a sweet pastry crust and creamy filling.', price: 45, category: 'Desserts', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Milk%20Tart%20dessert%20slice?width=800&height=600&nologo=true', isActive: true },
  { name: 'Koeksisters', description: 'Crispy, braided dough infused with sweet syrup.', price: 40, category: 'Desserts', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Koeksisters%20sweet%20braided%20pastry?width=800&height=600&nologo=true', isActive: true },
  { name: 'Vetkoek with Mince', description: 'Deep-fried dough filled with savory ground beef.', price: 65, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Vetkoek%20with%20savory%20Mince?width=800&height=600&nologo=true', isActive: true },
  { name: 'Bobotie', description: 'Spiced minced meat baked with an egg-based topping, served with yellow rice.', price: 110, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Bobotie%20with%20yellow%20rice?width=800&height=600&nologo=true', isActive: true },
  { name: 'Bunny Chow', description: 'Hollowed-out loaf of bread filled with spicy chicken curry.', price: 90, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Bunny%20Chow%20curry%20in%20bread?width=800&height=600&nologo=true', isActive: true },
  { name: 'Snoek Braai', description: 'Apricot-glazed snoek grilled over an open fire.', price: 130, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Snoek%20Braai%20grilled%20fish?width=800&height=600&nologo=true', isActive: true },
  { name: 'Chicken Feet (Runners)', description: 'Flavorful stewed chicken feet.', price: 40, category: 'Mains', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20stewed%20Chicken%20Feet%20dish?width=800&height=600&nologo=true', isActive: true },
  { name: 'Steamed Bread (Dombolo)', description: 'Soft, fluffy steamed bread, perfect for soaking up stews.', price: 30, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20Steamed%20Bread%20Dombolo%20loaf?width=800&height=600&nologo=true', isActive: true },
  { name: 'Roasted Vegetables', description: 'Seasonal mixed vegetables roasted with herbs and olive oil.', price: 45, category: 'Sides', imageBase64: 'https://image.pollinations.ai/prompt/professional%20food%20photography%20gourmet%20Roasted%20Vegetables%20platter?width=800&height=600&nologo=true', isActive: true }
];

const galleryImages = [
  { eventName: 'Limpopo Traditional Wedding', description: 'Beautiful traditional setup with authentic dishes.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Limpopo%20Traditional%20African%20Wedding%20feast?width=800&height=600&nologo=true' },
  { eventName: 'Corporate Year-End Function', description: 'Elegant dining for an end of year corporate celebration.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Corporate%20Year-End%20Function%20banquet%20hall?width=800&height=600&nologo=true' },
  { eventName: 'Family Reunion Picnic', description: 'Casual outdoor catering for a large family gathering.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Family%20Reunion%20Picnic%20outdoor%20buffet?width=800&height=600&nologo=true' },
  { eventName: 'Summer Garden Wedding', description: 'Romantic outdoor wedding with floral centerpieces.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Summer%20Garden%20Wedding%20outdoor%20reception%20tables?width=800&height=600&nologo=true' },
  { eventName: 'Gala Dinner', description: 'Formal dinner service with premium plated courses.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20formal%20Gala%20Dinner%20plated%20courses?width=800&height=600&nologo=true' },
  { eventName: 'Birthday Banquet', description: 'A lavish feast for a milestone 50th birthday.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20lavish%20Birthday%20Banquet%20feast%20table?width=800&height=600&nologo=true' },
  { eventName: 'Intimate Bridal Shower', description: 'Delicate pastries and treats for a small bridal shower.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Intimate%20Bridal%20Shower%20pastries%20high%20tea?width=800&height=600&nologo=true' },
  { eventName: 'Rustic Barn Wedding', description: 'Hearty homestyle catering in a rustic venue.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Rustic%20Barn%20Wedding%20hearty%20homestyle%20catering?width=800&height=600&nologo=true' },
  { eventName: 'Executive Luncheon', description: 'Light, healthy corporate lunch service.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20healthy%20Executive%20Luncheon%20corporate%20food?width=800&height=600&nologo=true' },
  { eventName: 'Heritage Day Braai', description: 'Massive outdoor braai setup with various meats.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Heritage%20Day%20Braai%20outdoor%20BBQ%20meat%20grill?width=800&height=600&nologo=true' },
  { eventName: 'Engagement Party', description: 'Tapas and cocktail food for an evening engagement.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Engagement%20Party%20tapas%20and%20cocktails?width=800&height=600&nologo=true' },
  { eventName: 'Anniversary Dinner', description: 'Private fine dining experience for an anniversary.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20romantic%20Anniversary%20fine%20dining%20table?width=800&height=600&nologo=true' },
  { eventName: 'Product Launch Event', description: 'Modern, chic appetizers for a brand launch.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20chic%20Product%20Launch%20Event%20appetizers?width=800&height=600&nologo=true' },
  { eventName: 'Festival Food Stall', description: 'Vibrant street-food style setup for a local festival.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20vibrant%20Festival%20Food%20Stall%20street%20food?width=800&height=600&nologo=true' },
  { eventName: 'Baby Shower Brunch', description: 'Morning brunch with fruits, pastries and mimosas.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Baby%20Shower%20Brunch%20fruits%20and%20pastries?width=800&height=600&nologo=true' },
  { eventName: 'Charity Fundraising Gala', description: 'Large scale catering for a charity event.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Charity%20Fundraising%20Gala%20catering%20hall?width=800&height=600&nologo=true' },
  { eventName: 'Graduation Celebration', description: 'A massive celebratory feast for a recent graduate.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Graduation%20Celebration%20party%20feast%20buffet?width=800&height=600&nologo=true' },
  { eventName: 'Beachside Wedding', description: 'Fresh seafood and vibrant salads by the beach.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Beachside%20Wedding%20seafood%20buffet%20on%20sand?width=800&height=600&nologo=true' },
  { eventName: 'Wine Tasting Pairing', description: 'Gourmet bites designed to pair with local wines.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Wine%20Tasting%20Pairing%20gourmet%20bites%20and%20glasses?width=800&height=600&nologo=true' },
  { eventName: 'Traditional Lobola', description: 'Traditional South African spread for a lobola negotiation.', imageBase64: 'https://image.pollinations.ai/prompt/professional%20event%20photography%20Traditional%20Lobola%20South%20African%20spread?width=800&height=600&nologo=true' }
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
