import UploadBox from "./upload-box";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Check Your Resume ATS Score</h1>

      <p className="text-muted-foreground mb-8 max-w-xl">
        Upload your resume and compare it against job descriptions.
      </p>

      <UploadBox />
    </section>
  );
}
