/*

<button id="btn">Open OK Dialog</button>
<button id="btn2">Open Delete Dialog</button>

<script>
const btn = document.getElementById('btn')
const btn2 = document.getElementById('btn2')

btn.onclick = () => {
  app.openOkModal(
    'Hi',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    modalResult
  )
}

btn2.onclick = () => {
  app.openDeleteModal(
    'Warning',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    modalResult
  )
}

function modalResult(result) {
  console.log(result)
}
</script>

*/
