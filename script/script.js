const container = document.getElementById('container');

const nbElements = 16;
const coefficient = 1;
const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`

const sequenceItems = [];

sequenceItems[0] = {};
sequenceItems[0].size = sequenceItems[0].fontSize = sequenceItems[0].top
  = sequenceItems[0].left = 0;

sequenceItems[1] = {};
sequenceItems[1].size = 1;
sequenceItems[1].fontSize = 1 / 3;
sequenceItems[1].top = sequenceItems[1].left = 0;

for (let i = 2; i < nbElements; i++) {
  let itemSize = sequenceItems[i - 1].size + sequenceItems[i - 2].size;
  let previousElement = sequenceItems[i - 1];

  sequenceItems[i] = {};
  sequenceItems[i].size = itemSize;
  sequenceItems[i].fontSize = itemSize / 3;
  if (i % 4 === 0) { // bottom left anchor
    sequenceItems[i].top = previousElement.top + previousElement.size;
    sequenceItems[i].left = previousElement.left;
  } else if (i % 4 === 1) { // bottom right anchor
    sequenceItems[i].top = previousElement.top + previousElement.size - itemSize;
    sequenceItems[i].left = previousElement.left + previousElement.size;
  } else if (i % 4 === 2) { // top right anchor
    sequenceItems[i].top = previousElement.top - itemSize;
    sequenceItems[i].left = previousElement.left + previousElement.size - itemSize;
  } else if (i % 4 === 3) { // top left anchor
    sequenceItems[i].top = previousElement.top;
    sequenceItems[i].left = previousElement.left - itemSize;
  }
}

// set container top and left position at 
// horizontal and vertical minimum position of last 2 elements
container.style.left = Math.min(
  sequenceItems.at(-1).left
  , sequenceItems.at(-2).left
) * -coefficient + 10 + 'px';
container.style.top = Math.min(
  sequenceItems.at(-1).top
  , sequenceItems.at(-2).top
) * -coefficient + 10 + 'px';

const sequenceElements = [];

sequenceItems.forEach(e => {
  let newBox = document.createElement('div');
  newBox.classList.add('box-item');
  newBox.textContent = e.size;
  newBox.style.backgroundColor = randomHsl();
  newBox.style.fontSize = e.size * coefficient / 3 + 'px';
  newBox.style.width = newBox.style.height = e.size * coefficient + 'px';
  newBox.style.top = e.top + 'px';
  newBox.style.left = e.left + 'px';
  sequenceElements.push(newBox);
  container.appendChild(newBox);
});

let lastElement = sequenceElements.at(-1);
lastElement.addEventListener('click', handleClick);
lastElement.classList.add('last-element');

function handleClick() {
  lastElement = sequenceElements.pop();
  lastElement.remove();
  sequenceElements.forEach((e, index) => {
    console.log(index);
    if (index >= nbElements - 1) {
      return;
    }
    e.textContent = sequenceItems[index + 1].size;
    e.style.width = e.style.height = sequenceItems[index + 1].size * coefficient + 'px';
    e.style.top = sequenceItems[index + 1].top + 'px';
    e.style.left = sequenceItems[index + 1].left + 'px';
    e.style.fontSize = sequenceItems[index + 1].size / 3 + 'px';
  });
  lastElement = sequenceElements.at(-1)
  lastElement.addEventListener('click', handleClick);
  lastElement.classList.add('last-element');

  let newBox = document.createElement('div');
  newBox.classList.add('box-item');
  newBox.textContent = 0;
  newBox.style.backgroundColor = randomHsl();
  newBox.style.size = 0;
  newBox.style.fontSize = 0;
  newBox.style.width = newBox.style.height = 0;
  newBox.style.top = 0;
  newBox.style.left = 0;
  sequenceElements.unshift(newBox);
  container.appendChild(newBox);
}

