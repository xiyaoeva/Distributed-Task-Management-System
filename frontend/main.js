
import { createStore } from 'https://cdn.skypack.dev/redux@4.2.1';
import { Provider, useDispatch, useSelector } from 'https://cdn.skypack.dev/react-redux@8.1.3';

const e = React.createElement;
const initial = { token:null, role:null, tasks:[], status:'disconnected' };

function reducer(state=initial, action){
  switch(action.type){
    case 'LOGIN_SUCCESS': return {...state, token:action.token, role:action.role};
    case 'SET_TASKS': return {...state, tasks: action.tasks};
    case 'ADD_TASK': return {...state, tasks: [action.task, ...state.tasks]};
    case 'SOCKET_STATUS': return {...state, status: action.value};
    default: return state;
  }
}
const store = createStore(reducer);

function useApi(){
  const token = useSelector(s=>s.token);
  async function get(path){
    const r = await fetch('http://localhost:4000'+path, { headers: token ? {Authorization:'Bearer '+token} : {} });
    return r.json();
  }
  async function post(path, body){
    const r = await fetch('http://localhost:4000'+path, {
      method:'POST',
      headers: {'Content-Type':'application/json', ...(token?{Authorization:'Bearer '+token}:{})},
      body: JSON.stringify(body)
    });
    return r.json();
  }
  return { get, post };
}

function Login(){
  const dispatch = useDispatch();
  const [u, setU] = React.useState('admin');
  const [p, setP] = React.useState('admin');
  async function onLogin(){
    const r = await fetch('http://localhost:4000/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:u, password:p})
    });
    if(r.ok){
      const data = await r.json();
      dispatch({type:'LOGIN_SUCCESS', token:data.token, role:data.role});
    } else alert('Login failed');
  }
  return e('div', {}, [
    e('h3', {key:1}, 'Login'),
    e('input', {key:2, value:u, onChange:e=>setU(e.target.value)}),
    e('input', {key:3, type:'password', value:p, onChange:e=>setP(e.target.value)}),
    e('button', {key:4, onClick:onLogin}, 'Login'),
  ]);
}

function TaskList(){
  const { get, post } = useApi();
  const dispatch = useDispatch();
  const tasks = useSelector(s=>s.tasks);
  const token = useSelector(s=>s.token);

  React.useEffect(()=>{
    if(!token) return;
    get('/api/tasks').then(data=> dispatch({type:'SET_TASKS', tasks:data}));
    const socket = io('http://localhost:4000');
    socket.on('connect', ()=> dispatch({type:'SOCKET_STATUS', value:'connected'}));
    socket.on('tasks', (msg)=>{
      if(msg.type==='created') dispatch({type:'ADD_TASK', task:msg.task});
    });
    return ()=> socket.close();
  },[token]);

  const [title, setTitle] = React.useState('');
  async function addTask(){
    if(!title.trim()) return;
    const created = await post('/api/tasks', {title});
    if(created.error){ alert(created.error); return; }
    setTitle('');
  }

  if(!token) return e('p', {}, 'Please login.');

  return e('div', {}, [
    e('h3', {key:1}, 'Tasks'),
    e('div', {key:2}, [
      e('input', {key:21, value:title, onChange:e=>setTitle(e.target.value)}),
      e('button', {key:22, onClick:addTask}, 'Add Task')
    ]),
    e('ul', {key:3},
      tasks.map(t=> e('li', {key:t._id}, t.title + ' — ' + (t.completed?'done':'open')))
    )
  ]);
}

function App(){
  const token = useSelector(s=>s.token);
  return e('div', {style:{fontFamily:'sans-serif', maxWidth:600, margin:'40px auto'}},
    [ e('h2', {key:1}, 'Distributed Task Management System'),
      token ? e(TaskList, {key:2}) : e(Login, {key:3})
    ]);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  e(Provider, {store}, e(App))
);
