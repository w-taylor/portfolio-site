from dataclasses import dataclass, field


@dataclass
class Grid:
    size: int = 6
    nodes: list[tuple[int, int]] = field(default_factory=list)
    server_index: int = 0
    probed: dict[tuple[int, int], dict] = field(default_factory=dict)

    @property
    def server_pos(self) -> tuple[int, int] | None:
        if self.nodes:
            return self.nodes[self.server_index]
        return None

    def is_node(self, row: int, col: int) -> bool:
        return (row, col) in self.nodes

    def is_server(self, row: int, col: int) -> bool:
        return self.server_pos == (row, col)

    def revealed_nodes(self) -> set[tuple[int, int]]:
        return {(r, c) for (r, c), info in self.probed.items() if info.get("hit")}


@dataclass
class Probe:
    row: int
    col: int
    hit: bool = False
    is_server: bool = False
    distance: int | None = None


@dataclass
class GameState:
    game_id: str
    mode: str  # "bot" or "multiplayer"
    game_code: str | None = None
    phase: str = "waiting"  # waiting, setup, playing, finished
    grids: dict[str, Grid] = field(default_factory=dict)
    placed: dict[str, bool] = field(default_factory=dict)
    current_turn: str = "p1"
    winner: str | None = None
    total_probes: int = 0
    ws_connections: dict = field(default_factory=dict)
    bot: object | None = None
