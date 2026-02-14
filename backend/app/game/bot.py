import random
from .models import Grid


class NodeSweepBot:
    def __init__(self, grid_size: int = 6):
        self.grid_size = grid_size
        self.probed: set[tuple[int, int]] = set()
        self.clues: list[tuple[int, int, int]] = []  # (row, col, distance)

    def place_nodes(self) -> tuple[list[list[int]], int]:
        all_cells = [(r, c) for r in range(self.grid_size) for c in range(self.grid_size)]
        chosen = random.sample(all_cells, 3)
        server_index = random.randint(0, 2)
        return [[r, c] for r, c in chosen], server_index

    def choose_probe(self) -> tuple[int, int]:
        all_cells = {(r, c) for r in range(self.grid_size) for c in range(self.grid_size)}
        available = all_cells - self.probed

        if self.clues:
            candidates = available
            for cr, cc, dist in self.clues:
                cells_at_dist = {
                    (r, c) for r, c in candidates
                    if abs(r - cr) + abs(c - cc) == dist
                }
                if cells_at_dist:
                    candidates = cells_at_dist

            if candidates:
                choice = random.choice(list(candidates))
            else:
                choice = random.choice(list(available))
        else:
            choice = random.choice(list(available))

        return choice

    def record_probe(self, row: int, col: int, hit: bool, distance: int | None) -> None:
        self.probed.add((row, col))
        if not hit and distance is not None:
            self.clues.append((row, col, distance))
        if hit:
            self.clues = [
                (cr, cc, d) for cr, cc, d in self.clues
                if not any(abs(row - cr) + abs(col - cc) == d for _ in [1])
            ]
