const commonmark = require('commonmark')

if (document.body.children.length === 1 &&
document.getElementsByTagName('pre')[0] !== undefined) {
  fetch(location.href).then(response => {
    if (response.headers.get('Content-Type') === 'text/markdown') {
      response.text().then(text => {
        let parser = new commonmark.Parser()
        let renderer = new commonmark.HtmlRenderer()

        let parsed = parser.parse(text)
        let rendered = renderer.render(parsed)

        let walker = parsed.walker()
        while(walker.current.type !== 'heading') walker.next()
        let title = (walker.current.type === 'heading') ? walker.current.firstChild.literal : 'Markdown Document' // Find relevant page content here?

        document.write(`
          <!DOCTYPE html>
          <title>${title}</title>
          <meta charset="utf-8"/>
          <meta http-equiv="Content-Type" content="text/html charset=utf-8"/>
          <link rel="stylesheet" href="agregore://theme/style.css"/>
          <link rel="stylesheet" href="agregore://theme/highlight.css"/>
          ${rendered}
          <script src="agregore://theme/highlight.js"></script>
          <script>
            if(window.hljs) hljs.initHighlightingOnLoad()

            const toAnchor = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id]')
            console.log('Anchoring', toAnchor)

            for(let element of toAnchor) {
              const anchor = document.createElement('a')
              anchor.setAttribute('href', '#' + element.id)
              anchor.setAttribute('class', 'agregore-header-anchor')
              anchor.innerHTML = element.innerHTML
              element.innerHTML = anchor.outerHTML
            }

            const INDENT_HEADINGS = [
              'H1',
              'H2',
              'H3'
            ]
            var currentDepth = 0
            Array.from(document.body.children).forEach(element => {
              if (INDENT_HEADINGS.includes(element.tagName)) {
                currentDepth = element.tagName.slice(-1)
                element.classList.add('agregore-depth' + (currentDepth - 1))
              } else element.classList.add('agregore-depth' + (currentDepth))
            })
          </script>
        `)
      })
    }
  })
}
