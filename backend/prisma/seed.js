import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const companyId = process.env.COMPANY_ID
if (!companyId) throw new Error('COMPANY_ID is missing from backend/.env')

const universities = [
  'Addis Ababa University',
  'Bahir Dar University',
  'Hawassa University',
  'Haramaya University',
  'Jimma University',
  'Mekelle University',
  'Adama Science and Technology University',
  'University of Gondar',
  'Samara University',
  'Arba Minch University',
  'Ambo University',
  'Assosa University',
  'Aksum University',
  'Debre Berhan University',
  'Debre Markos University',
  'Debre Tabor University',
  'Dilla University',
  'Dire Dawa University',
  'Jigjiga University',
  'Wolaita Sodo University',
  'Wollo University',
  'Wollega University',
  'Madda Walabu University',
  'Oda Bultum University',
  'Werabe University',
  'Wachemo University',
  'Mizan-Tepi University',
  'Bule Hora University',
  'Borana University',
  'Metu University',
  'Injibara University',
  'Raya University',
  'Debark University',
  'Dembi Dolo University',
  'Gambella University',
  'Kebri Dehar University',
  'Arsi University',
  'Salale University',
  'Kotebe Metropolitan University',
  'Addis Ababa Science and Technology University',
  'Ethiopian Civil Service University',
  'Ethiopian Defense University',
  'Ethiopian Police University',
  'Rift Valley University',
]
const courses = [
  'Data Structures and Algorithms',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Cybersecurity',
]
const slugify = (value) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

try {
  await prisma.company.upsert({
    where: { id: companyId },
    create: { id: companyId, name: 'Sura Study', slug: 'sura-study' },
    update: { name: 'Sura Study', slug: 'sura-study' },
  })
  for (const name of universities) {
    const university = await prisma.university.upsert({
      where: { companyId_slug: { companyId, slug: slugify(name) } },
      create: { companyId, name, slug: slugify(name) },
      update: { name },
    })
    for (const title of courses) {
      await prisma.course.upsert({
        where: { universityId_slug: { universityId: university.id, slug: slugify(title) } },
        create: { universityId: university.id, title, slug: slugify(title) },
        update: { title },
      })
    }
  }
  console.log('Sura Study company, universities, and course catalog are ready. Add reviewed material chunks before asking course questions.')
} finally {
  await prisma.$disconnect()
}
