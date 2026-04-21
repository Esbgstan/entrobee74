import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase.js';

const services = [
  {
    id: 'position-gen',
    name: 'Position Generator',
    description: 'Trading Receipt Generator Pro for visualizing market positions.',
    price: 1000,
    githubRepo: 'https://github.com/entrobee74/Position-gen'
  },
  {
    id: 'crypto-receipt',
    name: 'Crypto Receipt Builder',
    description: 'Receipt Builder Pro for generating custom transaction proofs.',
    price: 1500,
    githubRepo: 'https://github.com/entrobee74/crypto-receipt'
  },
  {
    id: 'support-center',
    name: 'Support Center Builder',
    description: 'Generate and customize your customer support portal and knowledge base instantly.',
    price: 2000,
    githubRepo: 'https://github.com/entrobee74/Support-center'
  }
];

async function seed() {
  for (const s of services) {
    await setDoc(doc(db, 'services', s.id), {
      name: s.name,
      description: s.description,
      price: s.price,
      githubRepo: s.githubRepo,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Seeded ${s.name}`);
  }
  console.log('Seeding complete. Exiting.');
  process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
