// SPDX-FileCopyrightText: Copyright (c) 2025 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const ChatActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, clearMessages } = useChatStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearChat = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm("Clear all chat messages? This action cannot be undone.");
      if (confirmed) {
        clearMessages();
        setIsOpen(false);
      }
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded-md transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat options"
      >
        <PlusIcon />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-1 z-50"
        >
          <button
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
              hasMessages
                ? "text-white hover:bg-neutral-700"
                : "text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleClearChat}
            disabled={!hasMessages}
          >
            <TrashIcon />
            Clear chat
          </button>
          {/* Future options like "Upload image" will go here */}
        </div>
      )}
    </div>
  );
}; 