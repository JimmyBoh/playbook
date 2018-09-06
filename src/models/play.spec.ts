import {resolve} from 'path';
import {ChildProcess, ExecOptions} from 'child_process';
import child_process from 'child_process';

import {test} from 'ava';
import {Play, IPlay} from './play';
import {Project, IProject} from './project';

test(`'Play' is a thing`, t => {
  t.is(typeof Play, 'function');
});

test(`'Play' options are required`, t => {
  t.throws(() => new Play(null));
});

test(`'Play' option 'name' is required`, t => {
  t.throws(() => new Play({
    name: null
  }));
});

test(`'Play' options auto-populate 'projects' property`, t => {
  let expected: IPlay = {
    name: 'Next Best Thing',
    projects: null
  };
  let play = new Play(expected);
  t.not(typeof play, 'undefined');
  t.true(Array.isArray(play.projects));
  t.is(play.projects.length, 0);
});

test(`'Play' options convert 'project-like' to 'Project'`, t => {
  let expected: IPlay = {
    name: 'Next Best Thing',
    projects: [{
      name: 'One Fish',
      cwd: '/two/fish',
      command: 'red-fish',
      args: ['blue', 'fish']
    }]
  };
  let play = new Play(expected);
  t.not(typeof play, 'undefined');
  t.true(Array.isArray(play.projects));
  t.is(play.projects.length, 1);
  t.true(play.projects[0] instanceof Project);
});

test(`'Play' options populate values`, t => {
  let expected: IPlay = {
    name: 'Ava Tests Project',
    cwd: '/some/test/directory'
  };
  let proj = new Play(expected);
  t.not(typeof proj, 'undefined');
  t.is(proj.name, expected.name);
  t.is(proj.cwd, expected.cwd);
});

test(`'run' executes each project`, t => {
  const mockExec = (command: string, args: ExecOptions): ChildProcess => {
    t.is(command, `${EXPECTED_PROJ.command} ${EXPECTED_PROJ.args.join(' ')}`);
    t.is(args.cwd, EXPECTED_PROJ.cwd);
    return null;
  };
  
  const EXPECTED_PROJ: IProject = {
    name: 'One Fish',
    cwd: '/two/fish',
    command: 'red-fish',
    args: ['blue', 'fish']
  };

  const EXPECTED_PLAY: IPlay = {
    name: 'Next Best Thing',
    cwd: '/some/test/location',
    projects: [EXPECTED_PROJ]
  };

  let play = new Play(EXPECTED_PLAY, mockExec);

  let result = play.run();

  t.is(result.length, 1);
  t.true(result[0] instanceof Project);
  t.is(result[0].currentProcess, null);
});

test(`Play 'toString' returns the name and project count`, t => {
  let expected: IPlay = {
    name: 'Next Best Thing',
    projects: [{
      name: 'One Fish',
      cwd: '/two/fish',
      command: 'red-fish',
      args: ['blue', 'fish']
    }, {
      name: 'Sam',
      cwd: '/i/am',
      command: 'green',
      args: ['eggs', 'ham']
    }]
  };
  let play = new Play(expected);
  let result = play.toString();
  t.is(typeof result, 'string');
  t.is(result, `${play.name} (${play.projects.length})`);
})