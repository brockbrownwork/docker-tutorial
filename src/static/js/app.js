function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
		<KeystrokeListener/>
			<Row>
				<Col>
					<div class = "center">
						<img src = "signet_logo.png" width = "25%" />
						<br/><br/>
						<p>Tracking System</p>
					</div>
				</Col>
			</Row>
            <Row>
                <Col>
                    <TodoListCard />
                </Col>
            </Row>
			<Row>
				<Col>
					<Dropdown/>
				</Col>
				<Col>
					<SomethingStupid dumb = 'whoops' count = '-42'/>
				</Col>
				<Col>
					<YouKnowWhatsNeat whatsNeat = 'Butterflies'/>
				</Col>
			</Row>
        </Container>
    );
}

var keystrokes = [];
var keystroke_debug = true;
var lastKeystrokeTime = Date.now() / 1000;
function KeystrokeListener() {
  const limitBetweenKeystrokes = 0.05; // to prevent accidental scans, i.e.: someone is mashing the keyboard
  const minimumScanLength = 6;
  React.useEffect(() => {
    const handleKeyDown = (event) => {
	   if  (event.keyCode >= 65 && event.keyCode <= 90 || // is it a letter?
			event.keyCode >= 48 && event.keyCode <= 57 || // or is it a number?
			event.key == "Enter") { // or is it the enter key?
			console.log(event.key);
			console.log("accumulated keystrokes: " + String(keystrokes));
			const secondsSinceEpoch = Date.now() / 1000;
			console.log("secondsSinceEpoch: " + String(secondsSinceEpoch));
			const secondsBetweenKeystrokes = secondsSinceEpoch - lastKeystrokeTime;
			console.log("Time between keystrokes: " + String(secondsSinceEpoch - lastKeystrokeTime));
			if (secondsBetweenKeystrokes < limitBetweenKeystrokes){
					keystrokes.push(event.key);
					console.log(keystrokes);
					if (keystrokes.length >= minimumScanLength && event.key == 'Enter') {
						console.log("SCAN COMPLETED: " + keystrokes.slice(0, -1).join(''));
					}
			} else {
			   keystrokes = [event.key];
			   console.log("Timed out, keystrokes have been reset.");
			}
		   lastKeystrokeTime = secondsSinceEpoch;
		}
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keystroke_debug]);
  if (keystroke_debug) {
  return(<p class = 'center'>The <i>listener</i> lives here. &#128066; &#128585;</p>);
  } else {
	  return ('');
  }
}

const Dropdown = () => {
  return (
    <div>
      <select>
        <option value="fruit">Fruit</option>
        <option value="vegetable">Vegetable</option>
        <option value="meat">Meat</option>
      </select>
    </div>
  );
};

function YouKnowWhatsNeat(props) {
  const [name, setName] = React.useState(props.whatsNeat);
  let period = '.';

  React.useEffect( () => {
	// console.log(name);
	// console.log("is this triggering?");
  } );

  function handleChange(e) {
	let newName = String(e.target.value);
	if (newName.length > 0) {
		newName = newName[0].toUpperCase() + newName.slice(1);
	}
	setName(newName);
  }
  const handleSubmit = (e) => {
	e.preventDefault();
	setName(e.target.value);
	console.log("name: " + name);
	setName('');
  }

  return (
    <form onSubmit = {handleSubmit} onChange = {handleChange}>
      <label>What's neat? &nbsp;
        <input
          type="text" 
          value={name}
        />
      </label>
	  <p>You know what's neat?<b> {name}</b></p>
    </form>
  );
}

function SomethingStupid(props) {
	const [count, setCount] = React.useState(props.count ? parseInt(props.count) : 0);
	
	React.useEffect( () => {
		console.log(`Whoa! The state just changed.\nCount is currently at ${count}.`);
	});
	
	function increment() {
		setCount(count + 1);
	}
	
	return <React.Fragment><p>Here's something of value, {props.dumb}.</p>
      <button onClick={increment}>
        Click me
      </button>
	  <p>{count}</p>
	  </React.Fragment>
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">Wow, live updates! Innit fancy??</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : "test"}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <i
                            className={`far ${
                                item.completed ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                <Col xs={10} className="name">
                    {item.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
