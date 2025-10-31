require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Job = require('./models/Job');

async function run() {
  await connectDB();
  try {
    const count = await Job.countDocuments();
    if (count > 0) {
      console.log(`Jobs already exist: ${count}. Nothing to seed.`);
      return;
    }

    const now = new Date();
    const jobs = [
      {
        title: 'Frontend Engineer',
        company: 'Acme Corp',
        location: 'Remote',
        description: 'Build delightful user interfaces with React and modern tooling. Collaborate with designers and backend engineers.',
        type: 'Full-time',
        salary: '$110k - $140k',
        createdAt: now,
      },
      {
        title: 'Backend Developer (Node.js)',
        company: 'Globex',
        location: 'New York, NY',
        description: 'Design scalable APIs with Express and MongoDB. Experience with authentication and testing preferred.',
        type: 'Full-time',
        salary: '$120k - $150k',
        createdAt: now,
      },
      {
        title: 'Full-Stack Developer',
        company: 'Initech',
        location: 'Austin, TX',
        description: 'Own features end-to-end across React and Node services. CI/CD and cloud familiarity a plus.',
        type: 'Full-time',
        salary: '$115k - $145k',
        createdAt: now,
      },
      {
        title: 'Data Engineer',
        company: 'Stark Industries',
        location: 'San Francisco, CA',
        description: 'Build reliable data pipelines and warehouses. Work with streaming, ETL, and analytics teams.',
        type: 'Full-time',
        salary: '$130k - $170k',
        createdAt: now,
      },
      {
        title: 'Product Designer',
        company: 'Wayne Enterprises',
        location: 'Gotham City',
        description: 'Craft intuitive user experiences and visuals. Partner closely with product and engineering.',
        type: 'Contract',
        salary: '$80/hr - $110/hr',
        createdAt: now,
      },
      {
        title: 'DevOps Engineer',
        company: 'Umbrella Corp',
        location: 'Remote',
        description: 'Automate infrastructure and deployments. Kubernetes, Docker, and monitoring experience required.',
        type: 'Full-time',
        salary: '$125k - $160k',
        createdAt: now,
      },
      {
        title: 'QA Automation Engineer',
        company: 'Hooli',
        location: 'Palo Alto, CA',
        description: 'Create robust automated test suites and frameworks. Work with Cypress/Jest and CI systems.',
        type: 'Full-time',
        salary: '$100k - $130k',
        createdAt: now,
      },
      {
        title: 'Intern, Software Engineering',
        company: 'Wonka Labs',
        location: 'Boston, MA',
        description: 'Hands-on experience across the stack. Mentorship and meaningful projects in a fast-paced team.',
        type: 'Internship',
        salary: '$30/hr - $38/hr',
        createdAt: now,
      },
      {
        title: 'Machine Learning Engineer',
        company: 'NeuralNet Labs',
        location: 'Remote',
        description: 'Develop and deploy production-grade ML models. Work closely with data scientists and platform engineers to scale inference.',
        type: 'Full-time',
        salary: '$140k - $180k',
        createdAt: now,
      },
    ];

    await Job.insertMany(jobs);
    console.log(`Seeded ${jobs.length} jobs.`);
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
