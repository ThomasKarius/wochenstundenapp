import React, { useMemo, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  onChange: (dataUrl?: string) => void;
  initialDataUrl?: string;
};

export default function SignaturePad({ onChange }: Props) {
  const ref = useRef<SignatureCanvas | null>(null);

  const canvasProps = useMemo(() => {
    return { className: "sigCanvas", width: 700, height: 180 };
  }, []);

  function clear() {
    ref.current?.clear();
    onChange(undefined);
  }

  function save() {
    const r = ref.current;
    if (!r || r.isEmpty()) {
      onChange(undefined);
      return;
    }
    onChange(r.getTrimmedCanvas().toDataURL("image/png"));
  }

  return (
    <div className="signatureWrap">
      <div className="sigBox">
        <SignatureCanvas
          ref={(r) => (ref.current = r)}
          canvasProps={canvasProps}
          backgroundColor="rgba(255,255,255,1)"
          onEnd={save}
        />
        <div className="small">Hier unterschreiben</div>
      </div>

      <div className="actions">
        <button type="button" className="secondary" onClick={clear}>
          Unterschrift löschen
        </button>
        <button type="button" className="secondary" onClick={save}>
          Unterschrift speichern
        </button>
      </div>
    </div>
  );
}
