// O'zbekiston umumta'lim maktablarida har bir fan qaysi sinflarda
// o'tilishini belgilaydi. Eslatma: bu ro'yxat umumiy dasturga asoslangan
// taxminiy tartib — aniq dastur o'zgarishlariga qarab keyin sozlanishi mumkin.

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export type ResourceSubject = {
  slug: string;
  name: string;
  grades: number[];
};

export const RESOURCE_SUBJECTS: ResourceSubject[] = [
  { slug: "boshlangich-talim", name: "Boshlang'ich ta'lim", grades: range(1, 4) },
  { slug: "ona-vatan-tuygusi", name: "Ona Vatan tuyg'usi", grades: range(1, 4) },
  { slug: "matematika", name: "Matematika", grades: range(1, 11) },
  { slug: "algebra", name: "Algebra", grades: range(7, 11) },
  { slug: "geometriya", name: "Geometriya", grades: range(7, 11) },
  { slug: "fizika", name: "Fizika", grades: range(6, 11) },
  { slug: "kimyo", name: "Kimyo", grades: range(7, 11) },
  { slug: "biologiya", name: "Biologiya", grades: range(5, 11) },
  { slug: "ona-tili-adabiyot", name: "Ona tili va adabiyot", grades: range(1, 11) },
  { slug: "ingliz-tili", name: "Ingliz tili", grades: range(1, 11) },
  { slug: "rus-tili", name: "Rus tili", grades: range(1, 11) },
  { slug: "nemis-tili", name: "Nemis tili", grades: range(5, 11) },
  { slug: "fransuz-tili", name: "Fransuz tili", grades: range(5, 11) },
  { slug: "tarix", name: "Tarix", grades: range(5, 11) },
  { slug: "jahon-tarixi", name: "Jahon tarixi", grades: range(5, 11) },
  { slug: "geografiya", name: "Geografiya", grades: range(5, 11) },
  { slug: "informatika", name: "Informatika", grades: range(5, 11) },
  { slug: "chizmachilik", name: "Chizmachilik", grades: range(8, 9) },
  { slug: "jismoniy-tarbiya", name: "Jismoniy tarbiya", grades: range(1, 11) },
  { slug: "tasviriy-sanat", name: "Tasviriy san'at", grades: range(1, 7) },
  { slug: "musiqa", name: "Musiqa", grades: range(1, 7) },
  { slug: "texnologiya", name: "Texnologiya", grades: range(1, 11) },
  { slug: "milliy-goya", name: "Milliy g'oya, ma'naviyat asoslari", grades: range(5, 11) },
  { slug: "iqtisodiyot-asoslari", name: "Iqtisodiyot asoslari", grades: range(10, 11) },
  { slug: "huquq-asoslari", name: "Huquq asoslari", grades: range(9, 11) },
  { slug: "chet-tili-boshqa", name: "Chet tili (boshqa)", grades: range(5, 11) },
];

export function getSubjectBySlug(slug: string): ResourceSubject | undefined {
  return RESOURCE_SUBJECTS.find((s) => s.slug === slug);
}
