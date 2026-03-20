"use client";

interface ContactFieldsProps {
  name: string;
  email: string;
  phone: string;
  onChange: (patch: { name?: string; email?: string; phone?: string }) => void;
}

export function ContactFields({
  name,
  email,
  phone,
  onChange,
}: ContactFieldsProps) {
  return (
    <div className="booking-contact-stack">
      <span className="eyebrow">Contact details</span>
      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input
            className="input"
            value={name}
            onChange={(event) => onChange({ name: event.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => onChange({ email: event.target.value })}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Phone</span>
        <input
          className="input"
          value={phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          placeholder="+1 312 555 0101"
        />
      </label>
    </div>
  );
}
