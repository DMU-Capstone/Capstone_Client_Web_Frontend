import React, { useRef, useState } from "react";

type Photo = { id: string; url: string; file: File };

const QueueCreate: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        hostName: "",
        maxPeople: "",
        ownerName: "",
        phone: "",
        location: "",
        about: "",
        openTime: "",
        closeTime: "",
    });

    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([
        "생활운동 헬스장",
        "생활운동 PT",
        "생활운동 피트니스",
        "생활운동 운동",
    ]);

    // 사진 업로드 (최대 3)
    const onPickImage = () => fileRef.current?.click();
    const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const next: Photo[] = [];
        for (const f of Array.from(files)) {
        if (photos.length + next.length >= 3) break;
        next.push({ id: crypto.randomUUID(), url: URL.createObjectURL(f), file: f });
        }
        setPhotos((prev) => [...prev, ...next].slice(0, 3));
        e.target.value = ""; // 같은 파일 재선택 허용
    };
    const removePhoto = (id: string) => setPhotos((p) => p.filter((x) => x.id !== id));

    // 키워드
    const addKeyword = () => {
        const k = keywordInput.trim();
        if (!k) return;
        if (!keywords.includes(k)) setKeywords((arr) => [...arr, k]);
        setKeywordInput("");
    };
    const removeKeyword = (k: string) => setKeywords((arr) => arr.filter((x) => x !== k));

    // 공용 change 핸들러
    const onInput =
        (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 간단 유효성
        if (!form.hostName || !form.ownerName || !form.phone) {
        alert("호스트 이름 / 대표자 이름 / 전화번호는 필수입니다.");
        return;
        }
        // 실제 전송용 FormData 예시
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        keywords.forEach((k) => fd.append("keywords", k));
        photos.forEach((p) => fd.append("images", p.file));

        // TODO: API 연동 (fetch/axios)
        console.log("제출 데이터", { form, keywords, photosCount: photos.length });
        alert("대기열 생성 요청을 보냈습니다. (콘솔 확인)");
    };

    return (
        <div className="min-h-dvh bg-white flex justify-center">
        <div className="w-full max-w-[420px] px-4 py-4">
            {/* 상단 제목/뒤로가기 */}
            <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => history.back()}
                aria-label="뒤로가기"
                className="p-2 rounded hover:bg-gray-100"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5z" />
                </svg>
            </button>
            <h1 className="text-xl font-extrabold">대기열 생성하기</h1>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-5">
            {/* 사진 업로드 3칸 */}
            <div>
                <label className="block text-sm font-semibold mb-2">사진 등록하기</label>
                <div className="grid grid-cols-3 gap-3">
                {/* 업로드 버튼 */}
                {photos.length < 3 && (
                    <button
                    type="button"
                    onClick={onPickImage}
                    className="aspect-square w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50"
                    >
                    <span className="text-2xl leading-none">＋</span>
                    <span className="text-xs mt-1">{photos.length + 1}/3</span>
                    </button>
                )}
                {/* 미리보기 */}
                {photos.map((p) => (
                    <div key={p.id} className="relative aspect-square w-full">
                    <img
                        src={p.url}
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 text-xs"
                        aria-label="사진 제거"
                    >
                        ✕
                    </button>
                    </div>
                ))}
                </div>
                <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onFiles}
                />
            </div>

            {/* 1행: 호스트 이름 / 최대인원 */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                <label className="text-sm font-semibold">호스트 이름</label>
                <input
                    className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="상호명"
                    value={form.hostName}
                    onChange={onInput("hostName")}
                />
                </div>
                <div>
                <label className="text-sm font-semibold">최대인원</label>
                <input
                    type="number"
                    min={1}
                    className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: 20"
                    value={form.maxPeople}
                    onChange={onInput("maxPeople")}
                />
                </div>
            </div>

            {/* 대표자 이름 */}
            <div>
                <label className="text-sm font-semibold">대표자 이름</label>
                <input
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="홍길동"
                value={form.ownerName}
                onChange={onInput("ownerName")}
                />
            </div>

            {/* 전화번호 */}
            <div>
                <label className="text-sm font-semibold">전화번호</label>
                <input
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="010-1111-1111"
                value={form.phone}
                onChange={onInput("phone")}
                />
            </div>

            {/* 위치 */}
            <div>
                <label className="text-sm font-semibold">위치</label>
                <input
                className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="주소 또는 간단 설명"
                value={form.location}
                onChange={onInput("location")}
                />
                {/* 지도 자리(플레이스홀더) */}
                <div className="mt-2 w-full h-32 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                지도 영역 (연동 예정)
                </div>
            </div>

            {/* 대표 키워드 */}
            <div>
                <label className="text-sm font-semibold">대표 키워드</label>
                <div className="mt-2 flex gap-2">
                <input
                    className="flex-1 h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="#키워드 입력"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                />
                <button
                    type="button"
                    onClick={addKeyword}
                    className="h-10 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    +
                </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                {keywords.map((k) => (
                    <span
                    key={k}
                    className="inline-flex items-center gap-1 px-2.5 h-8 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                    #{k}
                    <button
                        type="button"
                        onClick={() => removeKeyword(k)}
                        className="text-indigo-500 hover:text-indigo-700"
                        aria-label={`${k} 제거`}
                    >
                        ×
                    </button>
                    </span>
                ))}
                </div>
            </div>

            {/* 호스트 소개 */}
            <div>
                <label className="text-sm font-semibold">호스트 소개</label>
                <textarea
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="소개 내용을 입력하세요"
                value={form.about}
                onChange={onInput("about")}
                />
            </div>

            {/* 운영시간 */}
            <div>
                <label className="text-sm font-semibold">운영시간</label>
                <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                    type="time"
                    className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.openTime}
                    onChange={onInput("openTime")}
                />
                <span className="text-gray-500 text-sm">~</span>
                <input
                    type="time"
                    className="h-11 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.closeTime}
                    onChange={onInput("closeTime")}
                />
                </div>
            </div>

            {/* 제출 */}
            <button
                type="submit"
                className="w-full h-11 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.99]"
            >
                대기열 생성하기
            </button>
            </form>
        </div>
        </div>
    );
};

export default QueueCreate;