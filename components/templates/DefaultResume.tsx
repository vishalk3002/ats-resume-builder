import { generateResumePdf } from "@/lib/generatePdf";
import { useRouter } from "next/navigation";

type Props = {
  resumeText: string;
};

export default function DefaultTemplate({ resumeText }: Props) {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-10">
      <h1 className="text-4xl font-bold">Resume Preview</h1>
      <hr className="my-6" />
      <div className="whitespace-pre-wrap text-sm">{resumeText}</div>
      <button
        onClick={() => generateResumePdf(resumeText)}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

      <button
        onClick={() => {
          sessionStorage.removeItem("resume-source-data");
          router.push("/resume-builder");
        }}
        className="border px-4 py-2 rounded-lg"
      >
        Build Another Resume
      </button>
    </div>
  );
}
