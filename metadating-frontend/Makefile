# OS check
ifeq ($(shell uname), Darwin) # If MacOS
	IS_MAC=true
else
	IS_MAC=false
endif

kill-frontend:
	@if [ ${IS_MAC} ]; then \
        pkill -f 3000 || true; \
	else \
		fuser -k 3000-tcp; \
    fi
