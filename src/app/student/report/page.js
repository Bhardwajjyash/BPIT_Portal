import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import PrintButton from "./PrintButton";
import Link from "next/link";
import Image from "next/image";

export default async function ReportPage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('userId')?.value;

  if (!studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-600 font-bold mb-4">Not Authenticated</p>
          <Link href="/" className="text-blue-600 underline">Return to Login</Link>
        </div>
      </div>
    );
  }

  // Fetch student details, mentor, and APPROVED achievement records
  const [student, extra, co, certs, projects, research] = await Promise.all([
    prisma.student.findUnique({ 
      where: { id: studentId },
      include: { mentor: true }
    }),
    prisma.extraCurricular.findMany({ where: { studentId, status: 'APPROVED' } }),
    prisma.coCurricular.findMany({ where: { studentId, status: 'APPROVED' } }),
    prisma.certification.findMany({ where: { studentId, status: 'APPROVED' } }),
    prisma.project.findMany({ where: { studentId, status: 'APPROVED' } }),
    prisma.researchPaper.findMany({ where: { studentId, status: 'APPROVED' } })
  ]);

  const allAnnexures = [
    ...extra.map(item => ({ ...item, category: 'Extra-Curricular' })),
    ...co.map(item => ({ ...item, category: 'Co-Curricular' })),
    ...certs.map(item => ({ ...item, category: 'Certification' })),
    ...projects.map(item => ({ ...item, category: 'Project' })),
    ...research.map(item => ({ ...item, category: 'Research Paper' }))
  ];

  // Annexures start on Page 10
  const startingAnnexurePage = 10;

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white text-black font-sans">
      
      {/* 
        Strict Print Layout CSS:
        This prevents the "blank alternating page" issue by strictly defining the printable area
        and hiding any microscopic overflow that causes the browser to trigger a blank sheet.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; }
          .page-container {
             height: 260mm !important; 
             max-height: 260mm !important;
             min-height: 0 !important;
             padding: 0 !important;
             page-break-after: always;
             overflow: hidden !important;
             box-shadow: none !important;
          }
        }
      `}} />

      <div className="max-w-4xl mx-auto space-y-12 print:space-y-0">
        
        <PrintButton />

        {/* --- PAGE 1: COVER PAGE --- */}
        <div className="page-container bg-white px-12 py-16 shadow-lg min-h-[1056px] flex flex-col justify-between items-center text-center relative">
          <div className="w-full space-y-8 pt-12">
            <h1 className="text-3xl font-extrabold tracking-wide text-black underline uppercase">
              STUDENTS’ ACHIEVEMENT REPORT
            </h1>
            <h2 className="text-2xl font-bold text-black pt-4">
              Batch: {student?.batch || '2023 – 2027'}
            </h2>
            
            <div className="pt-8 space-y-3">
              <h3 className="text-xl font-bold underline inline-block">Submitted By:</h3>
              <div className="text-lg font-medium space-y-1 pt-1">
                <p>Enrollment No.: {student?.enrollmentNo}</p>
                <p>Name of Student : {student?.name}</p>
                <p>Section: {student?.section || 'A'}</p>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <h3 className="text-xl font-bold underline inline-block">Submitted To:</h3>
              <div className="text-lg font-medium pt-1">
                <p>Name of the Mentor: {student?.mentor?.name || 'Dr. C M Sharma'}</p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 pb-8 flex flex-col items-center">
            <div className="relative w-48 h-16">
              <Image 
                src="/logo2.png" 
                alt="BPIT Logo" 
                fill 
                sizes="192px"
                className="object-contain" 
                priority
              />
            </div>
            <div className="space-y-1 font-bold text-black text-lg">
              <p>DEPARTMENT OF INFORMATION TECHNOLOGY</p>
              <p>BHAGWAN PARSHURAM INSTITUTE OF TECHNOLOGY</p>
            </div>
            <div className="text-sm font-medium pt-4">1</div>
          </div>
        </div>

        {/* --- PAGE 2: VISION, MISSION OF INSTITUTE --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-bold text-center text-black uppercase">
              BHAGWAN PARSHURAM INSTITUTE OF TECHNOLOGY
            </h2>
            
            <div className="space-y-2 pt-2 text-center">
              <h3 className="text-lg font-bold underline">VISION OF THE INSTITUTE</h3>
              <p className="text-sm text-justify leading-relaxed pt-1">
                To establish a leading Global Center of Excellence in multidisciplinary education, training and research in the area of Engineering, Technology and Management. To produce technologically competent, morally & emotionally strong and ethically sound professionals who excel in their chosen field, practice commitment to their profession and dedicate themselves to the service of mankind.
              </p>
            </div>

            <div className="space-y-2 pt-4 text-center">
              <h3 className="text-lg font-bold underline">MISION OF THE INSTITUTE</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-justify leading-relaxed pt-1">
                <li>To develop world class Laboratories and other Infrastructure conducive in acquiring latest knowledge and expertise.</li>
                <li>To bridge the knowledge and competency gaps of institute’s fresh pass-outs vis-à-vis field requirements.</li>
                <li>To strengthen Industry- Institute Interaction and partnership for imbibing corporate culture amongst our faculty and students.</li>
                <li>To promote research culture among faculty and students enhancing their academic and professional confidence needed to face global challenges. To honour commitment towards social and moral values</li>
                <li>To honour commitment towards social and moral values.</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">2</div>
        </div>

        {/* --- PAGE 3: PROGRAM OUTCOMES (POs) --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-bold text-center text-black uppercase">
              BHAGWAN PARSHURAM INSTITUTE OF TECHNOLOGY
            </h2>
            <h3 className="text-lg font-bold text-center underline">PROGRAM OUTCOMES (POs)</h3>
            
            <div className="space-y-2 text-xs text-justify leading-normal pt-1">
              <p><strong>PO 1. Engineering Knowledge:</strong> Apply knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.</p>
              <p><strong>PO 2. Problem Analysis:</strong> Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.</p>
              <p><strong>PO 3. Design/development of Solutions:</strong> Design solutions for complex engineering problems and design system components or processes that meet specified needs with appropriate consideration for public health and safety, and the cultural, societal, and environmental considerations.</p>
              <p><strong>PO 4. Conduct Investigations of Complex Problems:</strong> Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.</p>
              <p><strong>PO 5. Modern Tool Usage:</strong> Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.</p>
              <p><strong>PO 6. The Engineer and Society:</strong> Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.</p>
              <p><strong>PO 7. Environment and Sustainability:</strong> Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.</p>
              <p><strong>PO 8. Ethics:</strong> Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.</p>
              <p><strong>PO 9. Individual and Team Work:</strong> Function effectively as an individual, and as a member or leader in diverse teams, and in multi-disciplinary settings.</p>
              <p><strong>PO 10. Communication:</strong> Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.</p>
              <p><strong>PO 11. Project Management and Finance:</strong> Demonstrate knowledge and understanding of the engineering and management principles and apply these to one’s own work, as a member and leader in a team, to manage projects and in multi-disciplinary environments.</p>
              <p><strong>PO 12. Life-long Learning:</strong> Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.</p>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">3</div>
        </div>

        {/* --- PAGE 4: DEPARTMENT SPECIFICS --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-bold text-center text-black uppercase">
              DEPARTMENT OF INFORMATION TECHNOLOGY
            </h2>
            
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold underline">VISION OF THE DEPARTMENT</h3>
              <p className="text-sm text-justify leading-relaxed pt-1">
                To emerge as a centre of excellence producing globally competent and morally sound professionals in the field of Information Technology who will practice commitment to their profession and dedicate themselves to the service of mankind.
              </p>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold underline">MISION OF THE DEPARTMENT</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-justify leading-relaxed pt-1">
                <li>To develop state-of-art laboratories providing relevant practical inputs to students.</li>
                <li>To provide strong knowledge base to students in the area of Information Technology and to train them as per the requirement of industries and research organizations.</li>
                <li>To facilitate institute industry interaction to the benefit of stake holders and motivate teachers for the continuous improvement of their academic standards.</li>
              </ul>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold underline">PROGRAM EDUCATIONAL OBJECTIVES (PEOs)</h3>
              <ul className="space-y-2 text-xs text-justify pt-1">
                <li><strong>PEO 1:</strong> Professional Excellence and Lifelong Learning: Graduates will establish themselves as competent professionals in the field of Information Technology with a strong foundation in computing principles, analytical skills, and a commitment to continuous learning, innovation, and interdisciplinary development.</li>
                <li><strong>PEO 2:</strong> Industry Readiness and Innovation: Graduates will contribute effectively to industry and research organizations by leveraging modern tools and technologies, demonstrating leadership, entrepreneurial skills, and the ability to adapt to rapidly changing technological environments.</li>
                <li><strong>PEO 3:</strong> Ethics, Sustainability and Societal Impact: Graduates will exhibit professional integrity, ethical values, and social responsibility while addressing real-world challenges, thereby contributing positively to sustainable development and national/global societal needs.</li>
              </ul>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold underline">PROGRAM SPECIFIC OUTCOMES (PSOs)</h3>
              <ul className="space-y-1 text-xs text-justify pt-1">
                <li><strong>PSO 1:</strong> Design reliable and efficient software systems using software design principles, algorithm design techniques and data structure.</li>
                <li><strong>PSO 2:</strong> Select appropriate software, hardware and networking environment for IT needs of any organization.</li>
                <li><strong>PSO 3:</strong> Use modern technologies such as Artificial Intelligence, Big Data, Cloud Computing for building real world applications.</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">4</div>
        </div>

        {/* --- PAGE 5: TABLE OF CONTENTS --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-8 pt-6">
            <h2 className="text-2xl font-bold text-center underline uppercase text-black">TABLE OF CONTENTS</h2>
            <div className="flex justify-between font-bold text-sm border-b border-black pb-2 px-2">
              <span>Details</span>
              <span>Page No</span>
            </div>
            <ul className="space-y-3 text-sm px-2">
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>Vision and Mission of the Institute</span><span>2</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>Program Outcomes (POs)</span><span>3</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>Department’s Vision, Mission, PEOs and PSOs</span><span>4</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>List of Extra-curricular Activities</span><span>6</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>List of Co-curricular Activities</span><span>6</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>List of Certification Courses</span><span>7</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>List of Projects Undertaken</span><span>7</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>List of Research Papers</span><span>8</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-1"><span>Details of any other achievements</span><span>8</span></li>
              <li className="flex justify-between font-semibold pt-2"><span>Annexures</span><span>9</span></li>
            </ul>
          </div>
          <div className="text-center text-sm font-medium pb-2">5</div>
        </div>

        {/* --- PAGE 6: TABLES PART 1 (EXTRA & CO-CURRICULAR) --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-8 pt-4 w-full">
            <h2 className="text-xl font-bold text-center underline uppercase text-black">ACHIEVEMENT DETAILS</h2>
            
            <div className="w-full">
              <h3 className="text-sm font-bold mb-3">1. List of Extra-curricular Activities</h3>
              {/* Force fully stretched columns using strictly applied percentage widths adding to 100% */}
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.No.</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '43%' }}>Title / Name</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '23%' }}>Organized By</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Semester</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {extra.length === 0 ? (
                    <tr><td colSpan="5" className="border border-black p-4 text-center text-gray-500">No records found.</td></tr>
                  ) : extra.map((act, index) => (
                    <tr key={act.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium">{act.title}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.organizedBy}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.semester}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <h3 className="text-sm font-bold mb-3">2. List of Co-curricular Activities</h3>
              {/* Force fully stretched columns using strictly applied percentage widths adding to 100% */}
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.No.</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '43%' }}>Title / Name</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '23%' }}>Organized By</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Semester</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {co.length === 0 ? (
                    <tr><td colSpan="5" className="border border-black p-4 text-center text-gray-500">No records found.</td></tr>
                  ) : co.map((act, index) => (
                    <tr key={act.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium">{act.title}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.organizedBy}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.semester}</td>
                      <td className="border border-black py-2 px-3 text-center">{act.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">6</div>
        </div>

        {/* --- PAGE 7: TABLES PART 2 (CERTIFICATIONS & PROJECTS) --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-8 pt-4 w-full">
            <div className="w-full">
              <h3 className="text-sm font-bold mb-3">3. List of Certification Courses</h3>
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.No.</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '43%' }}>Course Name</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '25%' }}>Certified By</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Semester</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.length === 0 ? (
                    <tr><td colSpan="5" className="border border-black p-4 text-center text-gray-500">No records found.</td></tr>
                  ) : certs.map((cert, index) => (
                    <tr key={cert.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium">{cert.courseName}</td>
                      <td className="border border-black py-2 px-3 text-center">{cert.certifiedBy}</td>
                      <td className="border border-black py-2 px-3 text-center">{cert.semester}</td>
                      <td className="border border-black py-2 px-3 text-center">{cert.mode} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <h3 className="text-sm font-bold mb-3">4. List of Projects Undertaken</h3>
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.No.</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '42%' }}>Project Name</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '30%' }}>Type</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Semester</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '20%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan="4" className="border border-black p-4 text-center text-gray-500">No records found.</td></tr>
                  ) : projects.map((proj, index) => (
                    <tr key={proj.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium">{proj.projectName}</td>
                      <td className="border border-black py-2 px-3 text-center">{proj.type}</td>
                      <td className="border border-black py-2 px-3 text-center">{proj.semester}</td>
                      <td className="border border-black py-2 px-3 text-center">{proj.projectStatus || proj.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">7</div>
        </div>

        {/* --- PAGE 8: TABLES PART 3 (RESEARCH PAPERS) --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-8 pt-4 w-full">
            <div className="w-full">
              <h3 className="text-sm font-bold mb-3">5. List of Research Papers</h3>
              <table className="w-full border-collapse border border-black text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.No.</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '42%' }}>Paper Title</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '17%' }}>Semester</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '30%' }}>Published By</th>
                    <th className="border border-black py-2 px-3 text-center" style={{ width: '20%' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {research.length === 0 ? (
                    <tr><td colSpan="4" className="border border-black p-4 text-center text-gray-500">No records found.</td></tr>
                  ) : research.map((paper, index) => (
                    <tr key={paper.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium">{paper.title}</td>
                      <td className="border border-black py-2 px-3 text-center">{paper.semester}</td>
                      <td className="border border-black py-2 px-3 text-center">{paper.publishedBy}</td>
                      <td className="border border-black py-2 px-3 text-center">{paper.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center text-sm font-medium pb-2">8</div>
        </div>

        {/* --- PAGE 9: TABLE OF ANNEXURE --- */}
        <div className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between">
          <div className="space-y-6 pt-2 w-full">
            <h2 className="text-xl font-bold text-center underline uppercase text-black mb-6">TABLE OF ANNEXURE</h2>
            
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black py-2 px-3 text-center" style={{ width: '8%' }}>S.NO.</th>
                  <th className="border border-black py-2 px-3 text-center" style={{ width: '22%' }}>ANNEXURE NO.</th>
                  <th className="border border-black py-2 px-3 text-center" style={{ width: '60%' }}>ASSOCIATED RECORD</th>
                  <th className="border border-black py-2 px-3 text-center" style={{ width: '15%' }}>PAGE NO.</th>
                </tr>
              </thead>
              <tbody>
                {allAnnexures.length === 0 ? (
                  <tr><td colSpan="4" className="border border-black p-4 text-center text-gray-500">No records submitted yet.</td></tr>
                ) : allAnnexures.map((item, index) => {
                  const pageNo = startingAnnexurePage + index;
                  return (
                    <tr key={item.id}>
                      <td className="border border-black py-2 px-3 text-center">{index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-bold">ANNEXURE {index + 1}</td>
                      <td className="border border-black py-2 px-3 text-center font-medium truncate">{item.title || item.projectName || item.courseName}</td>
                      <td className="border border-black py-2 px-3 text-center font-semibold">{pageNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-center text-sm font-medium pb-2">9</div>
        </div>

        {/* --- DYNAMIC ANNEXURE PAGES WITH ATTACHMENTS --- */}
        {allAnnexures.map((item, index) => {
          const currentPageNum = startingAnnexurePage + index;
          return (
            <div key={item.id} className="page-container bg-white p-12 shadow-lg min-h-[1056px] flex flex-col justify-between items-center text-center">
              <div className="w-full pt-2">
                <h2 className="text-2xl font-bold text-black tracking-wide uppercase">ANNEXURE {index + 1}</h2>
                <p className="text-sm font-medium text-gray-700 mt-1">{item.title || item.projectName || item.courseName} ({item.category})</p>
              </div>

              <div className="flex-1 w-full flex items-center justify-center my-4 h-[600px]">
                {item.proofUrl ? (
                  <div className="relative w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image 
                      src={item.proofUrl} 
                      alt={`Annexure ${index + 1} Proof`}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No proof document or image uploaded for this record.</p>
                )}
              </div>

              <div className="w-full flex justify-between text-xs text-gray-500 font-medium pt-4 border-t border-gray-300">
                <span>Student: {student?.name} ({student?.enrollmentNo})</span>
                <span>{currentPageNum}</span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}