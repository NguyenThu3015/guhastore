 
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar'; 

const TiptapEditor = ({ content, onChange }) => {
    const editor = useEditor({
        
        extensions: [
            StarterKit,
        ],
        
        content: content,
        
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); 
        },
        
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4 min-h-[300px] border border-gray-300 rounded-b-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
            },
        },
    });

    return (
        <div>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
