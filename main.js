// 1. تعريف العناصر الأساسية
let inp = document.getElementById('taskInput');
let btn = document.getElementById('addBtn');
let list = document.getElementById('taskList');
let query = document.querySelector('.search');
let title = document.querySelector('#app_title');

// 2. تحميل البيانات والعنوان من الـ LocalStorage
let arr = JSON.parse(localStorage.getItem('note')) || [];
title.innerText = localStorage.getItem('my_App_name') || 'to-do-List';

// 3. المستمعات (Event Listeners)
btn.addEventListener('click', add_Note);
// البحث يشتغل فوراً وأنت بتكتب
query.addEventListener('input', search_task);

// --- الدالات الأساسية ---

// دالة العرض والبحث (المسؤولة عن رسم الواجهة دائماً)
function search_task() {
  let searchValue = query.value.toLowerCase().trim();
  
  // فلترة المصفوفة بناءً على نص البحث
  let filtered = arr.filter(item => item.text.toLowerCase().includes(searchValue));

  // رسم العناصر المفلترة باستخدام map
  list.innerHTML = filtered.map((item) => {
    // نجيب الـ index الحقيقي للعنصر عشان التعديل (Update) يفضل شغال صح
    let realIndex = arr.findIndex(a => a.id === item.id);
    
    return `
      <div class="task-item">
        <li contenteditable="true" onblur='update(this, ${realIndex})'>${item.text}</li>
        <button onclick='deleNote(${item.id})' class="delete">Delete</button>
      </div>`;
  }).join('');
}

// دالة الإضافة
function add_Note() {
  if (inp.value.trim() !== '') {
    let note = {
      id: Date.now(),
      text: inp.value.trim()
    };
    arr.push(note);
    syncStorage();
  }
  inp.value = '';
  // بدل ما ننادي show_Note، بننادي search_task عشان لو فيه بحث شغال ميروحش
  search_task();
}

// دالة التحديث (تعديل النص)
function update(ele, index) {
  let newText = ele.innerText.trim();
  if (newText !== '') {
    arr[index].text = newText;
    syncStorage();
  } else {
    search_task(); // إعادة العرض لو المسح كان فارغاً
  }
}

// دالة الحذف بالـ ID
function deleNote(id) {
  arr = arr.filter(task => task.id !== id);
  syncStorage();
  search_task();
}

// دالة حفظ العنوان (تعديل عنوان التطبيق)
function save_title(ele) {
  let newWord = ele.innerText.trim();
  if (newWord !== '') {
    localStorage.setItem('my_App_name', newWord);
  } else {
    ele.innerText = localStorage.getItem('my_App_name') || 'to-do-List';
  }
}

// دالة مساعدة لحفظ المصفوفة في المتصفح
function syncStorage() {
  localStorage.setItem('note', JSON.stringify(arr));
}

// تشغيل العرض لأول مرة عند فتح الصفحة
search_task();
