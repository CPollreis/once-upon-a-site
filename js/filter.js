document.querySelectorAll('.filter-header').forEach(header => {
    header.addEventListener('click', (e) => {
        e.stopPropagation();
        const box = header.parentElement;
        box.classList.toggle('active');
    });
});

const filtersContainer = document.getElementById('filters-container');

let draggingBox = null;

filtersContainer.addEventListener('dragstart', e => {
    if (e.target.classList.contains('filter-box')) {
        draggingBox = e.target;
        e.target.classList.add('dragging');
    }
});

filtersContainer.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
    draggingBox = null;
});

filtersContainer.addEventListener('dragover', e => {
    e.preventDefault();
    const after = getDragAfter(filtersContainer, e.clientY);
    if (after == null) 
        filtersContainer.appendChild(draggingBox);
    else 
        filtersContainer.insertBefore(draggingBox, after);
});

function getDragAfter(container, y) {
    const boxes = [...container.querySelectorAll('.filter-box:not(.dragging)')];
    return boxes.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { 
        offset: Number.NEGATIVE_INFINITY 
    }).element;
}

const choices = document.querySelectorAll('.draggable-choice');
const placeholder = document.getElementById('selected-placeholder');
const selectedContainer = document.getElementById('selected-container');

choices.forEach(choice => {
    choice.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.target.classList.add('being-dragged');
    });
    choice.addEventListener('dragend', e => e.target.classList.remove('being-dragged'));
});

placeholder.addEventListener('dragover', e => {
    e.preventDefault();
    placeholder.classList.add('dragover');
});

placeholder.addEventListener('dragleave', () => placeholder.classList.remove('dragover'));

placeholder.addEventListener('drop', e => {
    e.preventDefault();
    placeholder.classList.remove('dragover');
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
        const draggedChoice = document.querySelector('.draggable-choice.being-dragged');
        if (draggedChoice) {
            const filterName = draggedChoice.dataset.filter;
            addSelectedTag(text, filterName);
            draggedChoice.classList.add('removed');
            setTimeout(() => draggedChoice.remove(), 150);
        }
    }
});

// Add tag to selected section
function addSelectedTag(text, filterName) {
    const existing = [...selectedContainer.children].some(tag => tag.textContent.startsWith(text));
    if (!existing) {
        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.dataset.choice = text;
        tag.dataset.filter = filterName;
        tag.textContent = text;
        tag.addEventListener('click', () => {
            restoreChoice(tag.dataset.choice, tag.dataset.filter);
            tag.remove();
        });
        selectedContainer.appendChild(tag);
    }    
}

function restoreChoice(text, filterName) {
    const parentBox = [...document.querySelectorAll('.filter-box')].find(box => box.querySelector('.filter-header').textContent.trim() === filterName);
    if (parentBox) {
        const content = parentBox.querySelector('.filter-content');
        const el = document.createElement('div');
        el.className = 'draggable-choice';
        el.draggable = true;
        el.dataset.filter = filterName;
        el.textContent = text;
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('being-dragged');
        });
        el.addEventListener('dragend', e => e.target.classList.remove('being-dragged'));
        content.appendChild(el);
    }
}
