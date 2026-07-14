import React, { useState } from 'react';

/**
 * Free-text tag input with datalist-style suggestions. Used for skills, but
 * written generically enough to reuse anywhere a short list of strings is
 * needed (e.g. filters).
 */
export default function TagInput({ value, onChange, suggestions = [], placeholder = 'Add and press Enter' }) {
  const [draft, setDraft] = useState('');

  const commit = (raw) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...value, tag]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (tag) => onChange(value.filter((v) => v !== tag));

  return (
    <div>
      <div className="cp-tag-input-wrap">
        {value.map((tag) => (
          <span className="cp-tag" key={tag}>
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          list="cp-tag-suggestions"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commit(draft)}
          placeholder={placeholder}
        />
      </div>
      <datalist id="cp-tag-suggestions">
        {suggestions.map((s) => (
          <option value={s} key={s} />
        ))}
      </datalist>
    </div>
  );
}
