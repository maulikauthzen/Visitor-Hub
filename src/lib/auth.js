const VALID_ROLES = ["user", "admin"];

export function getTokenRole(token = localStorage.getItem("token")) {
  if (!token) return null;

  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const base64 = payloadSegment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadSegment.length / 4) * 4, "=");
    const binaryPayload = atob(base64);
    const bytes = Uint8Array.from(binaryPayload, (character) =>
      character.charCodeAt(0),
    );
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof payload.exp === "number" && payload.exp <= Date.now() / 1000) {
      return null;
    }

    return VALID_ROLES.includes(payload.role) ? payload.role : null;
  } catch {
    return null;
  }
}
