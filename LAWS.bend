import Base

# Manifest-level model only. Actual dependency compatibility is checked by
# TypeScript, builds, tests and the Electron consumer.
type Build is Data:
  Build{runtime: U32, compiler: U32, contract: U32}

def runtime(version: U32, build: Build) -> Build:
  match build:
    case Build{_, compiler, contract}:
      Build{version, compiler, contract}

def compiler(version: U32, build: Build) -> Build:
  match build:
    case Build{runtime, _, contract}:
      Build{runtime, version, contract}

def observe(build: Build) -> U32:
  match build:
    case Build{_, _, contract}:
      contract

law independent_upgrades_commute:
  for +build: Build
  for +r: U32
  for +c: U32
  {runtime(r, compiler(c, build)) == compiler(c, runtime(r, build)) : Build}

law upgrade_is_idempotent:
  for +build: Build
  for +r: U32
  {runtime(r, runtime(r, build)) == runtime(r, build) : Build}

# The upgrade/observation square commutes: versions change, the required
# observable contract does not. This is a requirement, not a runtime proof.
law observation_is_preserved:
  for +build: Build
  for r: U32
  for c: U32
  {observe(runtime(r, compiler(c, build))) == observe(build) : U32}
