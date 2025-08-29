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

import { useFileIcons } from "../../hooks/useFileIcons";
import { useDeleteDocument } from "../../api/useCollectionDocuments";
import { useCollectionDrawerStore } from "../../store/useCollectionDrawerStore";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentItemProps {
  name: string;
  metadata: Record<string, any>;
  collectionName: string;
}

// Helper function to format metadata values for display
const formatMetadataValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "—";
  }
  
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  
  if (typeof value === "string") {
    // Handle string representations of booleans
    const lowerValue = value.toLowerCase().trim();
    if (lowerValue === "true" || lowerValue === "1" || lowerValue === "yes" || lowerValue === "on") {
      return "true";
    }
    if (lowerValue === "false" || lowerValue === "0" || lowerValue === "no" || lowerValue === "off") {
      return "false";
    }
    // Return the string as-is if it's not empty
    return value.trim() || "—";
  }
  
  return String(value);
};

export const DocumentItem = ({ name, metadata, collectionName }: DocumentItemProps) => {
  const { getFileIconByExtension } = useFileIcons();
  const queryClient = useQueryClient();
  const { setDeleteError } = useCollectionDrawerStore();
  const deleteDoc = useDeleteDocument();
  const handleDelete = () => {
    if (!collectionName) return;
    if (!window.confirm(`Delete document "${name}"?`)) return;
    setDeleteError(null);
    deleteDoc.mutate(
      { collectionName, documentName: name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["collection-documents", collectionName] });
        },
        onError: (err: any) => {
          setDeleteError(err?.message || "Failed to delete document");
        },
      }
    );
  };
  
  return (
    <div 
      className="border border-neutral-700 rounded-xl p-4 bg-neutral-900/80 transition-all duration-200"
      data-testid="document-item"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-shrink-0" data-testid="document-icon">
              {getFileIconByExtension(name, { size: 'sm' })}
            </div>
            <h3 
              className="font-medium text-white text-sm break-all"
              data-testid="document-name"
            >
              {name}
            </h3>
          </div>
          {Object.keys(metadata).filter(key => key !== 'filename').length > 0 && (
            <div className="mt-3 space-y-1" data-testid="document-metadata">
              {Object.entries(metadata)
                .filter(([key]) => key !== 'filename')
                .map(([key, val]) => (
                  <div key={key} className="flex flex-wrap gap-2 text-sm">
                    <span className="text-[var(--nv-green)] font-medium">{key}:</span>
                    <span className="text-gray-300">{formatMetadataValue(val)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteDoc.isPending}
          className="text-red-400 hover:text-red-300 text-xs border border-red-800/60 px-2 py-1 rounded-md disabled:opacity-50"
          aria-label={`Delete ${name}`}
          title="Delete"
        >
          {deleteDoc.isPending ? 'Deleting…' : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}; 