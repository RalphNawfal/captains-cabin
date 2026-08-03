/**
 * Structured data, rendered as a plain script tag so it lands in the static HTML
 * with no client JS involved.
 */

/**
 * Escape JSON for safe embedding inside a <script> element.
 *
 * This matters because `content/menu.json` is edited by the client through the
 * CMS at /admin/. A drink named `</script><img src=x onerror=alert(1)>` would
 * otherwise close the script element early and inject markup into the page —
 * stored XSS by way of the menu editor.
 *
 * `<`, `>` and `&` become unicode escapes, which JSON parsers resolve back to
 * the same characters, so consumers see identical structured data.
 *
 * U+2028 and U+2029 are valid inside JSON strings but are line terminators in
 * JavaScript source, so they are escaped too. Note they are written here as
 * `\u2028` escape sequences rather than literal characters — a literal one in
 * this file would itself break the parse.
 */
function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export default function JsonLd({ data }) {
  if (!data) return null
  const payload = Array.isArray(data) ? data : [data]

  return (
    <>
      {payload.filter(Boolean).map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJson(node) }}
        />
      ))}
    </>
  )
}
