import React from 'react';
import { FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaQuoteLeft, FaRedo, FaUndo } from 'react-icons/fa'; 

const Toolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const buttonClass = (type) => 
        `p-2 rounded hover:bg-gray-200 ${editor.isActive(type) ? 'bg-gray-300' : ''}`;

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded-t-lg">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass('bold')}>
                <FaBold />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass('italic')}>
                <FaItalic />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass('strike')}>
                <FaStrikethrough />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass({ level: 2 })}>
                <FaHeading />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass('bulletList')}>
                <FaListUl />
            </button>
             <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass('orderedList')}>
                <FaListOl />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass('blockquote')}>
                <FaQuoteLeft />
            </button>
            {}
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-gray-200">
                <FaUndo />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-gray-200">
                <FaRedo />
            </button>
        </div>
    );
};

export default Toolbar;
