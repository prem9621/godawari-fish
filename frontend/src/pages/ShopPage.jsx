import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Filter, Fish, RefreshCw, ExternalLink } from 'lucide-react';
import { api, resolveImageUrl } from '../utils/api';
import ScrollReveal from '../components/ScrollReveal';
import BubbleBackground from '../components/BubbleBackground';

const FISH_IMAGES = {
  'Prawn': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20prawns%20seafood%20display&image_size=square',
  'King Prawn': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Large%20king%20prawns%20seafood&image_size=square',
  'Pomfret': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=White%20pomfret%20fish&image_size=square',
  'Indian Salmon Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Indian%20salmon%20fish%20rawas&image_size=square',
  'Surmai (King Fish)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Surmai%20king%20fish%20seer%20fish&image_size=square',
  'Halwa (Black Pomfret)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20pomfret%20halwa%20fish&image_size=square',
  'Kolkata Ilish Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hilsa%20ilish%20fish%20bengali&image_size=square',
  'Betki Fish (Chaunak)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Betki%20chaunak%20fish&image_size=square',
  'Hamoor Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hamoor%20grouper%20fish&image_size=square',
  'Bangda (Mackerel)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bangda%20mackerel%20fish&image_size=square',
  'Tarli Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tarli%20sardine%20fish&image_size=square',
  'Kuppa Fish (Tuna)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tuna%20fish%20fresh&image_size=square',
  'Rani Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Pink%20perch%20rani%20fish&image_size=square',
  'Bombil (Bombay Duck)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bombay%20duck%20bombil%20fish&image_size=square',
  'Karli Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cobia%20karli%20fish&image_size=square',
  'Sakla (Bombay Maral)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Barracuda%20sakla%20fish&image_size=square',
  'Singada Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Singada%20fish%20konkan&image_size=square',
  'Toll Fish (Green Bone)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Green%20bone%20toll%20fish&image_size=square',
  'Red Snapper': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20snapper%20fish&image_size=square',
  'Mandeli Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mandeli%20coastal%20fish&image_size=square',
  'Kurchi Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Kurchi%20coastal%20fish&image_size=square',
  'Chand Paplet': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Silver%20pomfret%20chand%20paplet&image_size=square',
  'Karimi Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Karimi%20fish%20konkani&image_size=square',
  'Shark Fish (Baby Shark)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Baby%20shark%20fish&image_size=square',
  'Baam Fish (Black Baam)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20eel%20baam%20fish&image_size=square',
  'Pili Baam Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Yellow%20eel%20pili%20baam&image_size=square',
  'Lep Fish (Sole Fish)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sole%20fish%20lep%20flatfish&image_size=square',
  'Kane Fish (Lady Fish)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Lady%20fish%20kane%20tenualosa&image_size=square',
  'Tiny Prawn': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tiny%20prawns%20small%20shrimp&image_size=square',
  'Squids': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20squids%20calamari&image_size=square',
  'Mud Crabs': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mud%20crabs%20seafood&image_size=square',
  'Sea Crabs': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sea%20crabs%20seafood&image_size=square',
  'Oyster / Sneal': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20oysters%20seafood&image_size=square',
  'Rahu': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Rohu%20rahu%20freshwater%20fish&image_size=square',
  'Katla': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Katla%20freshwater%20fish&image_size=square',
  'River Surmai': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=River%20surmai%20freshwater%20fish&image_size=square',
  'Pangaasiuss': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Basa%20pangasius%20fish&image_size=square',
  'Tilapi': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tilapia%20fish&image_size=square',
  'Gawran Baam': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20eel%20gawran%20baam&image_size=square',
  'Marla Fish': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Marla%20freshwater%20fish%20maharashtra&image_size=square',
  'Tengda Fish (Kudlu Katarna)': 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20catfish%20tengda&image_size=square'
};

const getDefaultImage = (name) => {
  if (FISH_IMAGES[name]) return FISH_IMAGES[name];
  const key = Object.keys(FISH_IMAGES).find(k =>
    name.toLowerCase().includes(k.toLowerCase().split(' ')[0]) ||
    k.toLowerCase().includes(name.toLowerCase().split(' ')[0])
  );
  return key ? FISH_IMAGES[key] : null;
};

const FISH_CATALOGUE = [
  { name: 'Prawn', category: 'Sea Fish', emoji: '🦐', benefits: 'High protein, low fat, rich in selenium and iodine.', description: 'Fresh prawns, perfect for frying, curries and biryani.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20prawns%20seafood%20display&image_size=square' },
  { name: 'King Prawn', category: 'Sea Fish', emoji: '🦐', benefits: 'Excellent source of lean protein and zinc.', description: 'Large juicy king prawns. Ideal for grilling, tandoor and special occasions.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Large%20king%20prawns%20seafood&image_size=square' },
  { name: 'Pomfret', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in omega-3, vitamin D and calcium.', description: 'Premium white pomfret, perfect for frying and steaming.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=White%20pomfret%20fish&image_size=square' },
  { name: 'Indian Salmon Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'High in omega-3 fatty acids, good for heart health.', description: 'Tasty and nutritious Indian salmon. Great for curries and fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Indian%20salmon%20fish%20rawas&image_size=square' },
  { name: 'Surmai (King Fish)', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, omega-3, vitamin B12.', description: 'Premium surmai, great for curries, steaks and fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Surmai%20king%20fish%20seer%20fish&image_size=square' },
  { name: 'Halwa (Black Pomfret)', category: 'Sea Fish', emoji: '🐟', benefits: 'Good source of protein, low cholesterol.', description: 'Black pomfret with rich flavor. Excellent for deep fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20pomfret%20halwa%20fish&image_size=square' },
  { name: 'Kolkata Ilish Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Very rich in omega-3, great for brain health.', description: 'Famous Hilsa fish from Kolkata. A delicacy with unique flavor.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hilsa%20ilish%20fish%20bengali&image_size=square' },
  { name: 'Betki Fish (Chaunak)', category: 'Sea Fish', emoji: '🐟', benefits: 'Low fat, high protein, good for weight management.', description: 'Firm white flesh, ideal for koliwada fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Betki%20chaunak%20fish&image_size=square' },
  { name: 'Hamoor Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Excellent protein source, low saturated fat.', description: 'Premium grouper fish. Thick juicy flesh for grilling.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hamoor%20grouper%20fish&image_size=square' },
  { name: 'Bangda (Mackerel)', category: 'Sea Fish', emoji: '🐟', benefits: 'Very high omega-3, selenium, vitamin B12.', description: 'Fresh bangda for rava fry and curry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bangda%20mackerel%20fish&image_size=square' },
  { name: 'Tarli Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in calcium, omega-3 and vitamin D.', description: 'Small sardine-style fish, great for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tarli%20sardine%20fish&image_size=square' },
  { name: 'Kuppa Fish (Tuna)', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, low fat, rich in iron.', description: 'Fresh tuna fish, meaty and flavourful.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tuna%20fish%20fresh&image_size=square' },
  { name: 'Rani Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Good protein, low calories, easy to digest.', description: 'Pink perch with tender flesh. Perfect for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Pink%20perch%20rani%20fish&image_size=square' },
  { name: 'Bombil (Bombay Duck)', category: 'Sea Fish', emoji: '🐟', benefits: 'Low calorie, high protein, good for metabolism.', description: 'Iconic Bombay duck fish. Best for sun-dried or fried preparations.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bombay%20duck%20bombil%20fish&image_size=square' },
  { name: 'Karli Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in omega-3 and protein.', description: 'Cobia fish with firm flesh. Excellent for grilling.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cobia%20karli%20fish&image_size=square' },
  { name: 'Sakla (Bombay Maral)', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, good for muscle building.', description: 'Barracuda fish, firm and tasty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Barracuda%20sakla%20fish&image_size=square' },
  { name: 'Singada Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Good source of minerals and protein.', description: 'Popular in Konkan coastal cuisine.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Singada%20fish%20konkan&image_size=square' },
  { name: 'Toll Fish (Green Bone)', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in calcium and phosphorus.', description: 'Distinctive green bones, sweet white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Green%20bone%20toll%20fish&image_size=square' },
  { name: 'Red Snapper', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, omega-3, potassium.', description: 'Premium red snapper with firm white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20snapper%20fish&image_size=square' },
  { name: 'Mandeli Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in calcium and good fats.', description: 'Small coastal fish, great for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mandeli%20coastal%20fish&image_size=square' },
  { name: 'Kurchi Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Good protein and mineral content.', description: 'Tasty coastal fish with unique flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Kurchi%20coastal%20fish&image_size=square' },
  { name: 'Chand Paplet', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in omega-3, vitamin D, calcium.', description: 'Silver pomfret, the most premium pomfret variety.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Silver%20pomfret%20chand%20paplet&image_size=square' },
  { name: 'Karimi Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Good source of protein and healthy fats.', description: 'Perfect for Konkani style masala fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Karimi%20fish%20konkani&image_size=square' },
  { name: 'Shark Fish (Baby Shark)', category: 'Sea Fish', emoji: '🦈', benefits: 'Very high protein, low fat.', description: 'Tender baby shark meat. Rich flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Baby%20shark%20fish&image_size=square' },
  { name: 'Baam Fish (Black Baam)', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, omega-3, vitamin A.', description: 'Black eel fish with rich, hearty flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20eel%20baam%20fish&image_size=square' },
  { name: 'Pili Baam Fish', category: 'Sea Fish', emoji: '🐟', benefits: 'Rich in vitamins and minerals.', description: 'Yellow eel with distinctive taste.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Yellow%20eel%20pili%20baam&image_size=square' },
  { name: 'Lep Fish (Sole Fish)', category: 'Sea Fish', emoji: '🐟', benefits: 'Low calorie, high protein, easy to digest.', description: 'Flat sole fish with delicate white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sole%20fish%20lep%20flatfish&image_size=square' },
  { name: 'Kane Fish (Lady Fish)', category: 'Sea Fish', emoji: '🐟', benefits: 'High protein, good omega-3 content.', description: 'Slender lady fish with sweet flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Lady%20fish%20kane%20tenualosa&image_size=square' },
  { name: 'Tiny Prawn', category: 'Seafood', emoji: '🦐', benefits: 'High protein, iodine and selenium.', description: 'Small fresh prawns, ideal for prawn masala.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tiny%20prawns%20small%20shrimp&image_size=square' },
  { name: 'Squids', category: 'Seafood', emoji: '🦑', benefits: 'Low calorie, high protein, rich in copper.', description: 'Fresh squids, tender quality.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20squids%20calamari&image_size=square' },
  { name: 'Mud Crabs', category: 'Seafood', emoji: '🦀', benefits: 'High protein, omega-3, zinc.', description: 'Fresh mud crabs with rich, sweet meat.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mud%20crabs%20seafood&image_size=square' },
  { name: 'Sea Crabs', category: 'Seafood', emoji: '🦀', benefits: 'Rich in protein, minerals and B12.', description: 'Fresh sea crabs. Perfect for crab masala.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sea%20crabs%20seafood&image_size=square' },
  { name: 'Oyster / Sneal', category: 'Seafood', emoji: '🦪', benefits: 'Very high zinc, iron and vitamin B12.', description: 'Fresh oysters, great for pan fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20oysters%20seafood&image_size=square' },
  { name: 'Rahu', category: 'Fresh Water', emoji: '🐟', benefits: 'High protein, omega-3, good for digestion.', description: 'Most popular fresh water fish. Excellent for curries.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Rohu%20rahu%20freshwater%20fish&image_size=square' },
  { name: 'Katla', category: 'Fresh Water', emoji: '🐟', benefits: 'Rich in protein, omega-3, vitamins A and C.', description: 'Large fresh water fish with tender flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Katla%20freshwater%20fish&image_size=square' },
  { name: 'River Surmai', category: 'Fresh Water', emoji: '🐟', benefits: 'High protein, omega-3 and minerals.', description: 'Fresh water king fish. Rich flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=River%20surmai%20freshwater%20fish&image_size=square' },
  { name: 'Pangaasiuss', category: 'Fresh Water', emoji: '🐟', benefits: 'Low fat, high protein, good for weight loss.', description: 'Basa fish with mild white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Basa%20pangasius%20fish&image_size=square' },
  { name: 'Tilapi', category: 'Fresh Water', emoji: '🐟', benefits: 'High protein, low calories, selenium.', description: 'Mild and versatile fish. Easy to cook.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tilapia%20fish&image_size=square' },
  { name: 'Gawran Baam', category: 'Fresh Water', emoji: '🐟', benefits: 'High protein and iron content.', description: 'Local fresh water eel. Rich and hearty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20eel%20gawran%20baam&image_size=square' },
  { name: 'Marla Fish', category: 'Fresh Water', emoji: '🐟', benefits: 'Good protein, local nutritional benefits.', description: 'Fresh water fish popular in Maharashtra.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Marla%20freshwater%20fish%20maharashtra&image_size=square' },
  { name: 'Tengda Fish (Kudlu Katarna)', category: 'Fresh Water', emoji: '🐟', benefits: 'High protein, good for immunity.', description: 'Small fresh water catfish. Very tasty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20catfish%20tengda&image_size=square' }
];

const WEIGHT_OPTIONS = ['500g', '1 kg', '2 kg', '5 kg'];

const getCatalogueInfo = (name) =>
  FISH_CATALOGUE.find(f =>
    f.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(f.name.toLowerCase().split(' ')[0])
  ) || { category: 'Sea Fish', emoji: '🐟', benefits: 'Fresh and nutritious.', description: 'Fresh quality fish available daily.' };

const categoryColor = (cat) => ({ 'Sea Fish': 'bg-green-100 text-green-700', 'Seafood': 'bg-emerald-100 text-emerald-700', 'Fresh Water': 'bg-green-100 text-green-700' }[cat] || 'bg-gray-100 text-gray-700');
const categoryBar = (cat) => ({ 'Sea Fish': 'bg-gradient-to-r from-green-500 to-emerald-400', 'Seafood': 'bg-gradient-to-r from-emerald-500 to-teal-400', 'Fresh Water': 'bg-gradient-to-r from-green-500 to-emerald-400' }[cat] || 'bg-green-400');
const googleSearchUrl = (name) => `https://www.google.com/search?q=${encodeURIComponent(name + ' fish health benefits price how to cook')}`;

const FishCard = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState('1 kg');
  const [imgError, setImgError] = useState(false);
  const info = getCatalogueInfo(product.name);
  const hasRate = product.rate && Number(product.rate) > 0;
  const isAvailable = !product.availability || product.availability === 'Available';
  const imageUrl = (!imgError && resolveImageUrl(product.image_url || product.image)) || getDefaultImage(product.name);
  const waMsg = encodeURIComponent(`Hi Godawari Fish & Company 🐟\nI want to order:\n*${product.name}*\nWeight: ${selectedWeight}${hasRate ? `\nRate: ₹${product.rate}/${product.unit || 'kg'}` : ''}\nPlease confirm availability.`);

  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden glow-card ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className={`h-1.5 w-full ${categoryBar(info.category)}`} />
      <div className="relative overflow-hidden h-44 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} onError={() => setImgError(true)} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
        ) : (
          <span className="text-6xl">{info.emoji}</span>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{product.availability || 'Available'}</span>
        </div>
        <a href={googleSearchUrl(product.name)} target="_blank" rel="noopener noreferrer"
          className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full shadow transition">
          <ExternalLink size={11} /> Know More
        </a>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-800 leading-tight">{info.emoji} {product.name}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${categoryColor(info.category)}`}>{info.category}</span>
        </div>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed">{info.description}</p>
        <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs font-semibold text-green-700 mb-0.5">💚 Health Benefits</p>
          <p className="text-xs text-green-800">{info.benefits}</p>
        </div>
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Select Weight:</p>
          <div className="flex flex-wrap gap-1.5">
            {WEIGHT_OPTIONS.map(w => (
              <button key={w} onClick={() => setSelectedWeight(w)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${selectedWeight === w ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>{w}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">Rate per {product.unit || 'kg'}</p>
            {hasRate ? <p className="text-2xl font-extrabold text-green-600">₹{product.rate}</p> : <p className="text-sm font-semibold text-amber-600">Contact for Rate</p>}
          </div>
          {product.weight && Number(product.weight) > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full font-semibold">⚖️ {product.weight} {product.weight_unit || 'kg'}</span>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          <a href={`https://wa.me/919371306189?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 btn-glow bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 rounded-full text-center text-xs font-bold transition transform hover:scale-105 shadow flex items-center justify-center gap-1">
            <MessageCircle size={13} /> Order
          </a>
          <a href={googleSearchUrl(product.name)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-full text-xs font-bold transition">
            🔍 Google
          </a>
        </div>
      </div>
    </div>
  );
};

const StaticFishCard = ({ fish }) => {
  const [selectedWeight, setSelectedWeight] = useState('1 kg');
  const [imgError, setImgError] = useState(false);
  const imageUrl = !imgError ? (fish.image || getDefaultImage(fish.name)) : null;
  const waMsg = encodeURIComponent(`Hi Godawari Fish & Company 🐟\nI want to order:\n*${fish.name}*\nWeight: ${selectedWeight}\nPlease confirm price and availability.`);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden glow-card">
      <div className={`h-1.5 w-full ${categoryBar(fish.category)}`} />
      <div className="relative overflow-hidden h-44 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={fish.name} onError={() => setImgError(true)} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
        ) : (
          <span className="text-6xl">{fish.emoji}</span>
        )}
        <a href={googleSearchUrl(fish.name)} target="_blank" rel="noopener noreferrer"
          className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full shadow transition">
          <ExternalLink size={11} /> Know More
        </a>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-gray-800 leading-tight">{fish.emoji} {fish.name}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${categoryColor(fish.category)}`}>{fish.category}</span>
        </div>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed">{fish.description}</p>
        <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs font-semibold text-green-700 mb-0.5">💚 Health Benefits</p>
          <p className="text-xs text-green-800">{fish.benefits}</p>
        </div>
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Select Weight:</p>
          <div className="flex flex-wrap gap-1.5">
            {WEIGHT_OPTIONS.map(w => (
              <button key={w} onClick={() => setSelectedWeight(w)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition ${selectedWeight === w ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>{w}</button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <p className="text-xs text-gray-400">Rate</p>
          <p className="text-sm font-semibold text-amber-600">Contact for Rate</p>
        </div>
        <div className="flex gap-2 mt-auto">
          <a href={`https://wa.me/919371306189?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 btn-glow bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 rounded-full text-center text-xs font-bold transition transform hover:scale-105 shadow flex items-center justify-center gap-1">
            <MessageCircle size={13} /> Order
          </a>
          <a href={googleSearchUrl(fish.name)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-full text-xs font-bold transition">
            🔍 Google
          </a>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await api.getProductsWithRates();
      setDbProducts(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); document.title = 'Shop — Fresh Fish | Godawari Fish & Company'; }, []);

  // Create a map of database products by name for quick lookup
  const dbProductMap = new Map();
  dbProducts.forEach(p => {
    dbProductMap.set(p.name.toLowerCase(), p);
  });

  // Merge FISH_CATALOGUE with database data
  const mergedProducts = FISH_CATALOGUE.map(fish => {
    const dbProduct = dbProductMap.get(fish.name.toLowerCase());
    if (dbProduct) {
      return {
        ...fish,
        ...dbProduct,
        image_url: dbProduct.image_url || fish.image
      };
    }
    return {
      ...fish,
      product_id: null,
      rate: null,
      unit: 'kg',
      availability: 'Available',
      weight: null,
      weight_unit: 'kg'
    };
  });

  const categories = ['All', 'Sea Fish', 'Seafood', 'Fresh Water'];
  const filterFn = (name, cat) => {
    const info = getCatalogueInfo(name);
    const matchCat = activeCategory === 'All' || info.category === activeCategory || cat === activeCategory;
    return matchCat && name.toLowerCase().includes(search.toLowerCase());
  };
  const filteredProducts = mergedProducts.filter(p => filterFn(p.name, p.category));
  const totalCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white pt-32 pb-12 animate-gradient">
        <BubbleBackground count={15} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <img src="/godawari_logo.png" alt="Godawari Fish & Company" className="h-20 w-auto mx-auto mb-4 drop-shadow-xl animate-float" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Our Fish Menu</h1>
          <p className="text-green-100 text-lg mb-1">Godawari Fish & Company – 40+ Varieties</p>
          <p className="text-emerald-200 text-sm italic">"The Real Taste of Fresh Fish"</p>
          {lastUpdated && <p className="text-white/60 text-xs mt-2">Rates updated: {lastUpdated.toLocaleTimeString()}</p>}
        </div>
      </section>

      <section className="bg-white shadow-sm sticky top-[80px] z-30 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search fish..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat === 'All' ? '🐟 All' : cat === 'Sea Fish' ? '🌊 Sea Fish' : cat === 'Seafood' ? '🦐 Seafood' : '🏞️ Fresh Water'}
              </button>
            ))}
          </div>
          <button onClick={fetchProducts} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold whitespace-nowrap">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {activeCategory === 'All' ? 'All Fish' : activeCategory}
              <span className="ml-2 text-sm font-normal text-gray-400">({totalCount} varieties)</span>
            </h2>
            <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1"><Filter size={12} /> Click 🔍 to know more about any fish</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading fish menu...</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Fish size={48} className="mx-auto mb-4 opacity-30" />
              <p>No fish found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(p => (
                p.product_id ? (
                  <FishCard key={p.product_id || p.name} product={p} />
                ) : (
                  <StaticFishCard key={p.name} fish={p} />
                )
              ))}
            </div>
          )}

          <div className="mt-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-xl">
            <h3 className="text-2xl font-extrabold mb-2">Want Bulk / Wholesale Order?</h3>
            <p className="text-green-100 mb-6">Special rates for hotels, restaurants & catering!</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://wa.me/919371306189" target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg">💬 WhatsApp Order</a>
              <a href="tel:9371306189" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition transform hover:scale-105 shadow-lg">📞 Call Now</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
