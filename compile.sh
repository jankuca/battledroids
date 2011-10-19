./lib/closure-library/bin/calcdeps.py \
	--output_mode=compiled \
	--compiler_jar=./lib/closure-library/compiler.jar \
	--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
	--compiler_flags="--warning_level=VERBOSE" \
	--path=./lib/closure-library/ \
	--path=./lib/easel/src/ \
	--path=./app/ \
	--input=./app/js/main.js \
> app/js/app.js