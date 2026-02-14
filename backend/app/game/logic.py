from .models import Grid, Probe


def manhattan_distance(r1: int, c1: int, r2: int, c2: int) -> int:
    return abs(r1 - r2) + abs(c1 - c2)


def nearest_unrevealed_distance(grid: Grid, row: int, col: int) -> int:
    revealed = grid.revealed_nodes()
    unrevealed = [(r, c) for r, c in grid.nodes if (r, c) not in revealed]
    if not unrevealed:
        return 0
    return min(manhattan_distance(row, col, r, c) for r, c in unrevealed)


def get_invalidated_cells(grid: Grid, hit_row: int, hit_col: int) -> list[list[int]]:
    revealed = grid.revealed_nodes()
    unrevealed = [(r, c) for r, c in grid.nodes if (r, c) not in revealed]
    invalidated = []
    for (r, c), info in grid.probed.items():
        if info.get("hit") or info.get("invalidated"):
            continue
        old_dist = info.get("distance")
        if old_dist is None:
            continue
        if unrevealed:
            new_dist = min(manhattan_distance(r, c, nr, nc) for nr, nc in unrevealed)
        else:
            new_dist = None
        if new_dist != old_dist:
            invalidated.append([r, c])
            info["invalidated"] = True
    return invalidated


def process_probe(grid: Grid, row: int, col: int) -> Probe:
    if grid.is_node(row, col):
        is_server = grid.is_server(row, col)
        probe = Probe(row=row, col=col, hit=True, is_server=is_server)
    else:
        dist = nearest_unrevealed_distance(grid, row, col)
        probe = Probe(row=row, col=col, hit=False, distance=dist)

    grid.probed[(row, col)] = {
        "hit": probe.hit,
        "is_server": probe.is_server,
        "distance": probe.distance,
    }
    return probe


def validate_placement(positions: list[list[int]], server_index: int, grid_size: int = 6) -> str | None:
    if len(positions) != 3:
        return "Must place exactly 3 nodes"
    if server_index < 0 or server_index > 2:
        return "server_index must be 0, 1, or 2"
    seen = set()
    for pos in positions:
        if len(pos) != 2:
            return "Each position must be [row, col]"
        r, c = pos
        if not (0 <= r < grid_size and 0 <= c < grid_size):
            return f"Position ({r}, {c}) is out of bounds"
        if (r, c) in seen:
            return f"Duplicate position ({r}, {c})"
        seen.add((r, c))
    return None
