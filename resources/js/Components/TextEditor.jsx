import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ direction: "rtl" }],
                    ["link"],
                    ["code-block"],
                    ["clean"],
                ],
            },
        });

        quillRef.current.on("text-change", () => {
            const ops = quillRef.current.getContents().ops;
            onChange(JSON.stringify(ops));
        });
    }, [onChange]);

    useEffect(() => {
        if (!quillRef.current) return;

        if (!value) {
            quillRef.current.setContents([{ insert: "\n" }]);
            return;
        }

        try {
            const ops = typeof value === "string" ? JSON.parse(value) : value;
            const currentOps = quillRef.current.getContents().ops;

            if (JSON.stringify(currentOps) !== JSON.stringify(ops)) {
                quillRef.current.setContents({ ops });
            }
        } catch (error) {
            console.error("Failed to load editor value:", error);
        }
    }, [value]);

    return (
        <div className="border rounded-lg">
            <div
                ref={editorRef}
                className="min-h-[15rem] max-h-[30rem] overflow-y-auto blog-content-display"
            />
        </div>
    );
}
