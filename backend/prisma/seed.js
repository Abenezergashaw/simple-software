require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Users
  const adminPass = await bcrypt.hash('admin123', 10);
  const devPass = await bcrypt.hash('dev123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@simplesoftware.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@simplesoftware.com', passwordHash: adminPass, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'dev@simplesoftware.com' },
    update: {},
    create: { name: 'John Developer', email: 'dev@simplesoftware.com', passwordHash: devPass, role: 'DEVELOPER' },
  });

  // About
  await prisma.aboutContent.deleteMany();
  await prisma.aboutContent.create({
    data: {
      mission: 'To empower businesses by transforming their manual, time-consuming processes into seamless digital systems that save time, reduce errors, and drive growth.',
      vision: 'To be the most trusted technology partner for businesses across all industries, delivering solutions that are simple, powerful, and built to last.',
      companyDescription: 'Simple Software Development is a passionate team of developers dedicated to building custom software solutions for businesses. We specialize in web applications, mobile apps, and desktop systems that replace slow manual workflows with fast, reliable digital tools. From the first meeting to ongoing maintenance, we are with you every step of the way.',
      foundedYear: 2020,
      teamSize: 8,
      contactEmail: 'hello@simplesoftware.com',
      contactPhone: '+251 91 000 0000',
      location: 'Gondar, Ethiopia',
    },
  });

  // Services
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      { title: 'Web Applications', description: 'We build powerful, cloud-based web systems tailored to your business — from inventory management and HR portals to e-commerce platforms and customer dashboards. Accessible from any browser, any device, anywhere.', icon: 'Monitor', orderIndex: 1 },
      { title: 'Mobile Apps', description: 'Native and cross-platform mobile applications for Android and iOS. Whether it is a field sales app, a delivery tracker, or a customer-facing tool — we build mobile experiences your team will love using every day.', icon: 'Smartphone', orderIndex: 2 },
      { title: 'Desktop Applications', description: 'Robust desktop software for Windows, Mac, and Linux. Perfect for high-performance tools that need to work offline or integrate deeply with your hardware and local infrastructure.', icon: 'Laptop', orderIndex: 3 },
    ],
  });

  // Projects
  await prisma.project.deleteMany();

  const projects = [
    {
      title: 'SmartInventory Pro',
      shortDesc: 'Real-time inventory management system for a regional retail chain with 12 branches.',
      fullDesc: 'SmartInventory Pro replaced a completely manual stock-tracking process that was causing over ETB 50,000 in monthly losses from shrinkage and miscount errors. The system provides real-time stock levels across all 12 branches, automated low-stock alerts, supplier order management, and detailed analytics dashboards. Staff training took less than 2 hours thanks to the simple, clean interface.',
      category: 'WEB',
      clientName: 'RetailEthiopia Ltd',
      liveUrl: 'https://demo.simplesoftware.com',
      status: 'COMPLETED',
      completionPercent: 100,
      isPublic: true,
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-07-15'),
    },
    {
      title: 'HR & Payroll Portal',
      shortDesc: 'Complete HR management platform handling 200+ employees, attendance, leave, and payroll.',
      fullDesc: 'This HR portal digitized the entire employee lifecycle for a manufacturing company — from onboarding and contract management to daily attendance tracking, leave requests, and automated payroll calculations. The system reduced payroll processing time from 3 days to 2 hours and eliminated manual errors that were costing the company significantly each month.',
      category: 'WEB',
      clientName: 'GoldCoast Manufacturing Co.',
      liveUrl: null,
      status: 'COMPLETED',
      completionPercent: 100,
      isPublic: true,
      startDate: new Date('2023-08-01'),
      endDate: new Date('2024-01-20'),
    },
    {
      title: 'POS & Sales Dashboard',
      shortDesc: 'Point-of-sale system with real-time sales analytics for a restaurant chain.',
      fullDesc: 'A full-featured POS system built for a restaurant chain with 5 locations. Features include table management, order tracking, kitchen display integration, split billing, daily sales reports, and a management dashboard showing revenue trends, best-selling items, and staff performance. Works offline and syncs when connection is restored.',
      category: 'WEB',
      clientName: 'Tastee Restaurant Group',
      liveUrl: 'https://demo.simplesoftware.com',
      status: 'COMPLETED',
      completionPercent: 100,
      isPublic: true,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-05-30'),
    },
    {
      title: 'DeliverEase Driver App',
      shortDesc: 'Mobile delivery tracking app for drivers and dispatchers with real-time GPS.',
      fullDesc: 'DeliverEase is a cross-platform mobile app that transformed a logistics company\'s delivery operations. Drivers receive orders directly on their phones, navigate with integrated maps, capture proof-of-delivery photos, and update delivery status in real time. Dispatchers see a live dashboard of all deliveries. The app reduced failed deliveries by 40% in the first month.',
      category: 'MOBILE',
      clientName: 'QuickShip Logistics',
      liveUrl: null,
      status: 'COMPLETED',
      completionPercent: 100,
      isPublic: true,
      startDate: new Date('2023-05-01'),
      endDate: new Date('2023-09-10'),
    },
    {
      title: 'School Management App',
      shortDesc: 'Student information system with parent portal for a K-12 private school.',
      fullDesc: 'A comprehensive school management mobile and web system covering student enrollment, class schedules, teacher attendance, gradebook, fee payment tracking, and a parent portal where parents can check their child\'s grades, attendance, and receive school announcements in real time. Replaced paper-based processes across all departments.',
      category: 'MOBILE',
      clientName: 'Sunrise Academy',
      liveUrl: null,
      status: 'IN_PROGRESS',
      completionPercent: 75,
      isPublic: true,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-01'),
    },
    {
      title: 'AccountEdge Desktop',
      shortDesc: 'Offline-first accounting software for SMEs with invoicing, expenses, and tax reports.',
      fullDesc: 'AccountEdge is a Windows desktop accounting application designed for small and medium businesses that need reliable financial management without internet dependency. Features include double-entry bookkeeping, customer invoicing, expense tracking, bank reconciliation, VAT calculations, and financial report generation (P&L, Balance Sheet). The client reported saving 15+ hours per week on manual bookkeeping.',
      category: 'DESKTOP',
      clientName: 'SME Solutions Ethiopia',
      liveUrl: null,
      status: 'COMPLETED',
      completionPercent: 100,
      isPublic: true,
      startDate: new Date('2022-09-01'),
      endDate: new Date('2023-02-28'),
    },
  ];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        ...p,
        finance: {
          create: {
            budget: Math.random() * 30000 + 5000,
            totalExpenses: Math.random() * 10000 + 2000,
            totalRevenue: Math.random() * 30000 + 10000,
            paymentStatus: p.status === 'COMPLETED' ? 'PAID' : 'PARTIAL',
          },
        },
      },
    });

    // Add milestones for each project
    await prisma.milestone.createMany({
      data: [
        { projectId: project.id, title: 'Requirements & Planning', status: 'DONE', dueDate: p.startDate },
        { projectId: project.id, title: 'UI/UX Design', status: p.completionPercent >= 30 ? 'DONE' : 'IN_PROGRESS', dueDate: new Date(p.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) },
        { projectId: project.id, title: 'Development Phase', status: p.completionPercent >= 80 ? 'DONE' : p.completionPercent >= 30 ? 'IN_PROGRESS' : 'PENDING', dueDate: new Date(p.startDate.getTime() + 90 * 24 * 60 * 60 * 1000) },
        { projectId: project.id, title: 'Testing & QA', status: p.completionPercent === 100 ? 'DONE' : 'PENDING', dueDate: p.endDate },
        { projectId: project.id, title: 'Deployment & Handover', status: p.completionPercent === 100 ? 'DONE' : 'PENDING', dueDate: p.endDate },
      ],
    });

    // Add a note
    await prisma.projectNote.create({
      data: { projectId: project.id, userId: admin.id, content: `Project setup complete. Client briefing done and requirements documented.` },
    });
  }

  console.log('Seed complete!');
  console.log('Admin login: admin@simplesoftware.com / admin123');
  console.log('Dev login:   dev@simplesoftware.com  / dev123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
