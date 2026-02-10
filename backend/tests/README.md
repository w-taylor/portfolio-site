# Backend Tests

## Setup

From the `backend/` directory:

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
```

## Running Tests

To run all tests:

```bash
pytest -v
```

To run all tests in a file:

```bash
pytest path/to/tests.py -v
```

To run an individual test:

```bash
pytest path/to/tests.py::test_new_func -v
```

No Docker or database needed — all external dependencies are mocked.
