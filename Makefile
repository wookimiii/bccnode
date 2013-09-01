################################################################################
#
#  Makefile tips:
#
#  1.) Commands starting with '@' are not echoed.
#  2.) In task comments are echoed by default.
#  3.) In task comments starting with '@' (e.g. '@# foo') are not echoed.
#  4.) Environment variables are accessable via '$(ENV_VAR_NAME)'.
#
#	Example:
#
#	#file: makefile
#	test_var:
#		echo "$(FOOBAR)"
#
#	$ make test_var FOOBAR=foobar
#	echo "foobar"
#	foobar
#	$
#
#  5.) Commands starting with '-' will not exit make if command fails.
#
################################################################################

NODE_EXEC = NODE_PATH=.:$(NODE_PATH) env \
			NODE_ENV=$(NODE_ENV)

NODE_BIN     = node
NODE_MODS    = ./node_modules/.bin
SUPERVISOR   = supervisor -q -w models,handlers,assets,views,app.js -e 'jade|js|node' -x $(NODE_BIN)

console:
	# starting node console with $(NODE_PARENT)/$(NODE_ENV)
	$(NODE_EXEC) $(NODE_BIN)

debug:
	# running app in debug mode with '$(NODE_PARENT)/$(NODE_ENV)'
	$(NODE_EXEC) $(NODE_BIN) --prof --debug app.js

run:
	# running app with '$(NODE_PARENT)/$(NODE_ENV)'
	$(NODE_EXEC) $(NODE_MODS)/$(SUPERVISOR) app.js

backup:
	# download a copy of the catechisms db
	./scripts/backup.sh

.PHONY:
