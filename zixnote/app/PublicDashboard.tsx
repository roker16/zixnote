"use client";
import { Box } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sections = [
  {
    title: "NCERT",
    children: [
      {
        label: "Class 9",
        children: [
          { label: "Science", href: "#" },
          { label: "Geography - Contemporary India I", href: "#" },
          { label: "Political Science - Democratic Politics I", href: "#" },
          { label: "Economics", href: "#" },
          { label: "History - India and the Contemporary World I", href: "#" },
        ],
      },
      {
        label: "Class 10",
        children: [
          { label: "Science", href: "#" },
          { label: "Geography - Contemporary India II", href: "#" },
          { label: "Political Science - Democratic Politics II", href: "#" },
          {
            label: "Economics - Understanding Economic Development",
            href: "#",
          },
          { label: "History - India and the Contemporary World II", href: "#" },
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
          { label: "General Studies Paper - III", href: "#" },
          { label: "General Studies Paper - IV", href: "#" },
        ],
      },
      {
        label: "Optional I",
        children: [
          { label: "Sociology", href: "#" },
          { label: "Geography", href: "#" },
          { label: "Anthropology", href: "#" },
          { label: "Public Administration", href: "#" },
        ],
      },
      {
        label: "Optional II",
        children: [
          { label: "Sociology", href: "#" },
          { label: "Geography", href: "#" },
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
];

function renderLinks(items: any[], depth = 0, router: any) {
  return (
    <ol className={`space-y-1 ${depth > 0 ? "pl-1" : ""}`}>
      {items.map((item, index) => {
        const isLeaf = !("children" in item);

        const handleClick = () => {
          if (item.href && item.href !== "#") {
            // Save custom data in localStorage
            localStorage.setItem("lastVisitedNote", item.label);
            localStorage.setItem("noteHref", item.href);

            // Navigate
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
                {renderLinks(item.children, depth + 1, router)}
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
      {/* Logo + Header */}
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

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Box
            key={section.title}
            // className="p-4 rounded-xl border border-transparent transition-all duration-200 hover:border-neutral-400"
          >
            <div className="flex full justify-left">
              <h2 className="text-sm font-medium text-red-900 bg-neutral-200 px-2 py-1 rounded mb-3 inline-block">
                {section.title}
              </h2>
            </div>
            {renderLinks(section.children, 0, router)}
          </Box>
        ))}
      </div>
    </main>
  );
}
