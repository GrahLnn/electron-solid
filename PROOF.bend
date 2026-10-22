import Base
import ./LAWS.bend as Laws

def Laws.independent_upgrades_commute(build, r, c):
  match build:
    case Laws.Build{_, _, _}:
      {==}

def Laws.upgrade_is_idempotent(build, r):
  match build:
    case Laws.Build{_, _, _}:
      {==}

def Laws.observation_is_preserved(build, r, c):
  match build:
    case Laws.Build{_, _, _}:
      {==}
