import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel p-6 text-sm">
      페이지를 찾을 수 없습니다.{" "}
      <Link href="/" className="text-desk-accent underline">
        Dashboard로 이동
      </Link>
    </div>
  );
}
