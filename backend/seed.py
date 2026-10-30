import os

from sqlalchemy import select

from models import Company, Course, University, db

UNIVERSITIES = [
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
COURSES = [
    'Data Structures and Algorithms',
    'Database Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Cybersecurity',
]


def slugify(value):
    return '-'.join(value.lower().split())


def main(app_instance=None):
    company_id = os.getenv('COMPANY_ID')
    if not company_id:
        raise SystemExit('COMPANY_ID is missing from backend/.env')
    
    def seed_db():
        company = db.session.get(Company, company_id)
        if not company:
            company = Company(id=company_id, name='Sura Study', slug='sura-study')
            db.session.add(company)
        else:
            company.name = 'Sura Study'
            company.slug = 'sura-study'
        for name in UNIVERSITIES:
            university_slug = slugify(name)
            university = db.session.scalar(select(University).where(University.company_id == company_id, University.slug == university_slug))
            if not university:
                university = University(company_id=company_id, name=name, slug=university_slug)
                db.session.add(university)
                db.session.flush()
            for title in COURSES:
                course_slug = slugify(title)
                course = db.session.scalar(select(Course).where(Course.university_id == university.id, Course.slug == course_slug))
                if not course:
                    db.session.add(Course(university_id=university.id, title=title, slug=course_slug))
        db.session.commit()
        print('Sura Study company, universities, and courses are ready.')

    if app_instance:
        with app_instance.app_context():
            seed_db()
    else:
        seed_db()


if __name__ == '__main__':
    main()
