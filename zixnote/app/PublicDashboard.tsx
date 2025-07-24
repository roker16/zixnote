"use client";
import { saveActiveContext } from "@/utils/ai/contextStorage";
import { Box } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";

const sections = [
  {
    title: "NCERT",
    children: [
      {
        label: "Class 9",
        children: [
          {
            label: "Science",
            href: "/manage-notes?f=11&group=school&id1=5&id2=1&id=1&name=Science",
          },
          {
            label: "Geography - Contemporary India I",
            href: "/manage-notes?f=11&group=school&id1=5&id2=1&id=171&name=Geography+–+Contemporary+India+I",
          },
          {
            label: "Political Science - Democratic Politics I",
            href: "/manage-notes?f=11&group=school&id1=5&id2=1&id=172&name=Political+Science+–+Democratic+Politics+I",
          },
          {
            label: "Economics",
            href: "/manage-notes?f=11&group=school&id1=5&id2=1&id=173&name=Economics",
          },
          {
            label: "History - India and the Contemporary World I",
            href: "/manage-notes?f=11&group=school&id1=5&id2=1&id=170&name=History+–+India+and+the+Contemporary+World+–+I",
          },
        ],
      },
      {
        label: "Class 10",
        children: [
          {
            label: "Science",
            href: "/manage-notes?f=11&group=school&id1=6&id2=1&id=164&name=Science",
          },
          {
            label: "Geography - Contemporary India II",
            href: "/manage-notes?f=11&group=school&id1=6&id2=1&id=166&name=Geography+%28India+and+Contemporary+II%29",
          },
          {
            label: "Political Science - Democratic Politics II",
            href: "/manage-notes?f=11&group=school&id1=6&id2=1&id=169&name=Political+Science+%28Democratic+Politcs+II%29",
          },
          {
            label: "Economics - Understanding Economic Development",
            href: "/manage-notes?f=11&group=school&id1=6&id2=1&id=167&name=Economics+%28Understanding+Economic+Development%29",
          },
          {
            label: "History - India and the Contemporary World II",
            href: "/manage-notes?f=11&group=school&id1=6&id2=1&id=168&name=History+%28India+and+the+Contemporary+World+–+II%29",
          },
        ],
      },
      {
        label: "Class 11",
        children: [
          {
            label: "Biology",
            href: "/manage-notes?f=11&group=school&id1=7&id2=1&id=121&name=Biology",
          },
          {
            label: "Chemistry Part I",
            href: "/manage-notes?f=11&group=school&id1=7&id2=1&id=113&name=Chemistry+Part+1",
          },
          {
            label: "Chemistry Part II",
            href: "/manage-notes?f=11&group=school&id1=7&id2=1&id=123&name=Chemistry+Part+II",
          },
          {
            label: "Physics Part I",
            href: "/manage-notes?f=11&group=school&id1=7&id2=1&id=122&name=Physics+Part+-I",
          },
          {
            label: "Physics Part II",
            href: "/manage-notes?f=11&group=school&id1=7&id2=1&id=124&name=Physics+Part+II",
          },
          {
            label: "Geography - Fundamentals of Physical Geography",
            href: "#",
          },
          { label: "Geography - India Physical Environment", href: "#" },
          {
            label: "Political Science - Indian Constitution at Work",
            href: "#",
          },
          { label: "Political Science - Political Theory", href: "#" },
          { label: "Sociology - Introducing Sociology", href: "#" },
          { label: "Sociology - Understanding Society", href: "#" },
          { label: "Economics - Indian Economic Development", href: "#" },
          { label: "Economics - Statistics for Economics", href: "#" },
        ],
      },
      {
        label: "Class 12",
        children: [
          {
            label: "Biology",
            href: "/manage-notes?f=11&group=school&id1=8&id2=1&id=129&name=Biology",
          },
          {
            label: "Chemistry Part I",
            href: "/manage-notes?f=11&group=school&id1=8&id2=1&id=127&name=Chemistry+Part+I",
          },
          {
            label: "Chemistry Part II",
            href: "manage-notes?f=11&group=school&id1=8&id2=1&id=128&name=Chemistry+Part+II",
          },
          {
            label: "Physics Part I",
            href: "/manage-notes?f=11&group=school&id1=8&id2=1&id=125&name=Physics+Part+I",
          },
          {
            label: "Physics Part II",
            href: "/manage-notes?f=11&group=school&id1=8&id2=1&id=126&name=Physics+Part+II",
          },
          { label: "Geography - Fundamentals of Human Geography", href: "#" },
          { label: "Geography - India People and Economy", href: "#" },
          {
            label: "Political Science - Contemporary World Politics",
            href: "#",
          },
          {
            label: "Political Science - Politics in India Since Independence",
            href: "#",
          },
          { label: "Sociology - Indian Society", href: "#" },
          {
            label: "Sociology - Social Change and Development in India",
            href: "#",
          },
          { label: "Economics - Introductory Microeconomics", href: "#" },
          { label: "Economics - Introductory Macroeconomics", href: "#" },
        ],
      },
    ],
  },
  {
    title: "UPSC-CS",
    children: [
      {
        label: "General Studies",
        children: [
          {
            label: "General Studies Paper - I",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=9&id=95&name=General+Studies+-+I+%28complete%29",
          },
          {
            label: "General Studies Paper - II",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=10&id=96&name=General+Studies+-+II+%28Complete%29",
          },
          {
            label: "General Studies Paper - III",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=11&id=97&name=General+Studies+-+III+%28complete%29",
          },
          { label: "General Studies Paper - IV", href: "#" },
        ],
      },
      {
        label: "Optional I",
        children: [
          {
            label: "Sociology",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=7&id=110&name=Sociology+Paper+-+I+%28Fundamentals+of+sociology%29",
          },
          {
            label: "Geography",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=7&id=111&name=Geography+Paper+-+I+%28Principles+of+Geography%29",
          },
          { label: "Anthropology", href: "#" },
          { label: "Public Administration", href: "#" },
        ],
      },
      {
        label: "Optional II",
        children: [
          {
            label: "Sociology",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=8&id=109&name=Sociology+Paper+-+II+%28Indian+society%3A+structure+and+change%29",
          },
          {
            label: "Geography",
            href: "/manage-notes?f=11&group=exam&id1=4&id2=8&id=112&name=Geography+Paper+-+II+%28Geography+of+India%29",
          },
          { label: "Anthropology", href: "#" },
          { label: "Public Administration", href: "#" },
        ],
      },
      {
        label: "Current Affairs",
        children: [
          { label: "Daily Current Affairs", href: "#" },
          { label: "Monthly Compilation", href: "#" },
        ],
      },
      {
        label: "CSAT (Prelims Paper II)",
        children: [
          { label: "Comprehension", href: "#" },
          { label: "Basic Numeracy", href: "#" },
        ],
      },
    ],
  },
  {
    title: "MBBS (AS PER NMC)",
    children: [
      {
        label: "Volume I",
        children: [
          {
            label: "Human Anatomy",
            href: "/manage-notes?f=11&group=college&id1=18&id2=17&id=133&name=Human+Anatomy",
          },
          { label: "Physiology", href: "#" },
          { label: "Biochemistry", href: "#" },
          { label: "Pharmacology", href: "#" },
          { label: "Pathology", href: "#" },
          { label: "Microbiology", href: "#" },
          { label: "Forensic Medicine & Toxicology", href: "#" },
        ],
      },
      {
        label: "Volume II",
        children: [
          { label: "Community Medicine", href: "#" },
          { label: "General Medicine", href: "#" },
          { label: "Respiratory Medicine", href: "#" },
          { label: "Pediatrics", href: "#" },
          { label: "Psychiatry", href: "#" },
          { label: "Dermatology, Venereology & Leprosy", href: "#" },
          { label: "Physical Medicine & Rehabilitation", href: "#" },
        ],
      },
      {
        label: "Volume III",
        children: [
          { label: "General Surgery", href: "#" },
          { label: "Ophthalmology", href: "#" },
          { label: "Otorhinolaryngology - ENT", href: "#" },
          { label: "Obstetrics & Gynaecology", href: "#" },
          { label: "Orthopedics", href: "#" },
          { label: "Anesthesiology", href: "#" },
          { label: "Radiodiagnosis", href: "#" },
          { label: "Radiotherapy", href: "#" },
        ],
      },
    ],
  },
  {
    title: "AEN (Railway)",
    children: [
      {
        label: "All Subject",
        children: [
          {
            label: "Civil Engg (General)",
            href: "/manage-notes?f=11&group=exam&id1=5&id2=4&id=85&name=Civil+Engineering+%28General%29",
          },
          {
            label: "Civil Engg (Railway)",
            href: "/manage-notes?f=11&group=exam&id1=5&id2=4&id=84&name=Civil+Engineering+%28Railways%29",
          },
          {
            label: "Establishment & Finance",
            href: "/manage-notes?f=11&group=exam&id1=5&id2=4&id=88&name=Establishment+and+Financial+rules",
          },
          {
            label: "Rajbhasha and GK",
            href: "/manage-notes?f=11&group=exam&id1=5&id2=4&id=89&name=General+knowledge+and+Official+language+policy+and+rules",
          },
        ],
      },
    ],
  },
];

function renderLinks(
  items: any[],
  depth = 0,
  router: any,
  sectionTitle: string,
  parentLabel: string = ""
) {
  return (
    <ol className={`space-y-1 ${depth > 0 ? "pl-1" : ""}`}>
      {items.map((item, index) => {
        const isLeaf = !("children" in item);

        const handleClick = () => {
          if (item.href && item.href !== "#") {
            // Determine context by section
            if (sectionTitle === "NCERT") {
              saveActiveContext({
                type: "school",
                schoolName: "NCERT",
                className: parentLabel,
                bookName: item.label,
              });
            } else if (sectionTitle === "UPSC-CS") {
              saveActiveContext({
                type: "exam",
                examName: "UPSC civil services",
                paperName: parentLabel,
                subjectName: item.label,
              });
            } else if (sectionTitle === "MBBS (AS PER NMC)") {
              saveActiveContext({
                type: "college",
                collegeName: "Medical",
                department: "MBBS (as per NMC)",
                course: item.label,
              });
            }

            router.push(item.href);
          }
        };

        return (
          <li
            key={index}
            className="text-xs flex items-start gap-1 text-neutral-700"
          >
            {isLeaf ? (
              <>
                <span>{index + 1}.</span>
                <button
                  onClick={handleClick}
                  className="bg-transparent p-0 m-0 border-none text-left text-neutral-700 hover:underline hover:text-neutral-900 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                >
                  {item.label}
                </button>{" "}
                {item.href !== "#" && <span>✅</span>}
              </>
            ) : (
              <div className="mt-2 mb-1">
                <h3
                  className={`${
                    depth === 0
                      ? "text-sm font-semibold"
                      : "text-xs font-medium"
                  } text-neutral-700`}
                >
                  {item.label}
                </h3>
                {renderLinks(
                  item.children,
                  depth + 1,
                  router,
                  sectionTitle,
                  item.label
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function PublicDashboard() {
  const router = useRouter();
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex justify-center items-center gap-3">
          <div className="h-11 w-11 rounded-full border-2 bg-slate-200 p-2 flex items-center justify-center">
            <Image src="/logo.png" alt="Dizinote logo" width={42} height={42} />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight leading-none pb-1">
            Dizinote
          </h1>
        </div>
        <p className="mt-0.5 text-sm text-neutral-500">
          An AI-based notes making platform
        </p>
        <div className="relative mt-2 flex justify-center items-center">
          <div className="w-40 h-px bg-neutral-300" />
          <span className="absolute bg-white px-2 text-neutral-400 text-sm">
            ✨
          </span>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Box key={section.title}>
            <div className="flex full justify-left">
              <h2 className="text-sm font-medium text-red-900 bg-neutral-200 px-2 py-1 rounded mb-3 inline-block">
                {section.title}
              </h2>
            </div>
            {renderLinks(section.children, 0, router, section.title)}
          </Box>
        ))}
      </div>
    </main>
  );
}
