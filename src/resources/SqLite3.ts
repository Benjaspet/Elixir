import * as Database from "better-sqlite3";

const SqLite3 = {
    master: new Database("src/databases/Elixir.db")
}

export default SqLite3;