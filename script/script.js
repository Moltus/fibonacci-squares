const container = document.getElementById('container');

const nbElements = 16;
const coefficient = 1;
const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`

const sequenceTemplates = [];

const transformFromTemplate = (source, template, isNew = false) => {
  source.textContent = template.size;
  source.style.fontSize = template.size * coefficient / 3 + 'px';
  source.style.width = source.style.height = template.size * coefficient + 'px';
  source.style.top = template.top + 'px';
  source.style.left = template.left + 'px';
  if (isNew) {
    source.classList.add('box-item');
    source.style.backgroundColor = randomHsl();
  }
  return true;
}

sequenceTemplates[0] = {};
sequenceTemplates[0].size = sequenceTemplates[0].fontSize = sequenceTemplates[0].top
  = sequenceTemplates[0].left = 0;

sequenceTemplates[1] = {};
sequenceTemplates[1].size = 1;
sequenceTemplates[1].fontSize = 1 / 3;
sequenceTemplates[1].top = sequenceTemplates[1].left = 0;

for (let i = 2; i < nbElements; i++) {
  let itemSize = sequenceTemplates[i - 1].size + sequenceTemplates[i - 2].size;
  let previousElement = sequenceTemplates[i - 1];

  sequenceTemplates[i] = {};
  sequenceTemplates[i].size = itemSize;
  sequenceTemplates[i].fontSize = itemSize / 3;
  if (i % 4 === 0) { // bottom left anchor
    sequenceTemplates[i].top = previousElement.top + previousElement.size;
    sequenceTemplates[i].left = previousElement.left;
  } else if (i % 4 === 1) { // bottom right anchor
    sequenceTemplates[i].top = previousElement.top + previousElement.size - itemSize;
    sequenceTemplates[i].left = previousElement.left + previousElement.size;
  } else if (i % 4 === 2) { // top right anchor
    sequenceTemplates[i].top = previousElement.top - itemSize;
    sequenceTemplates[i].left = previousElement.left + previousElement.size - itemSize;
  } else if (i % 4 === 3) { // top left anchor
    sequenceTemplates[i].top = previousElement.top;
    sequenceTemplates[i].left = previousElement.left - itemSize;
  }
}

// set container top and left position at 
// horizontal and vertical minimum position of last 2 elements
container.style.left = Math.min(
  sequenceTemplates.at(-1).left
  , sequenceTemplates.at(-2).left
) * -coefficient + 10 + 'px';
container.style.top = Math.min(
  sequenceTemplates.at(-1).top
  , sequenceTemplates.at(-2).top
) * -coefficient + 10 + 'px';

const sequenceElements = [];

sequenceTemplates.forEach(e => {
  let newBox = document.createElement('div');
  transformFromTemplate(newBox, e, true);
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
    transformFromTemplate(e, sequenceTemplates[index + 1]);
  });
  lastElement = sequenceElements.at(-1)
  lastElement.addEventListener('click', handleClick);
  lastElement.classList.add('last-element');

  let newBox = document.createElement('div');
  transformFromTemplate(newBox, sequenceTemplates[0]);
  sequenceElements.unshift(newBox);
  container.appendChild(newBox);
}

