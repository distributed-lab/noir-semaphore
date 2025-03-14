SHELL := /bin/bash

BB ?= bb
SCHEME ?= ultra_honk

BUILD_DIR       := ./target
SEMAPHORE_JSON  := $(BUILD_DIR)/semaphore.json
SEMAPHORE_GZ    := $(BUILD_DIR)/semaphore.gz
PROOF           := $(BUILD_DIR)/proof
VK              := $(BUILD_DIR)/vk
CONTRACT        := $(BUILD_DIR)/Verifier.sol

.DEFAULT_GOAL := all

.PHONY: all prove vk verify gates contract clean

all: prove vk verify

prove:
	$(BB) prove --scheme $(SCHEME) \
	            -b $(SEMAPHORE_JSON) \
	            -w $(SEMAPHORE_GZ) \
	            -o $(PROOF)

vk:
	$(BB) write_vk --scheme $(SCHEME) \
	               -b $(SEMAPHORE_JSON) \
	               -o $(VK)

verify: prove vk
	$(BB) verify --scheme $(SCHEME) \
	             -k $(VK) \
	             -p $(PROOF)

gates:
	$(BB) gates --scheme $(SCHEME) \
	            -b $(SEMAPHORE_JSON)


contract: contract_$(SCHEME)

contract_plonk:
	$(BB) contract -o $(CONTRACT)

contract_ultra_honk:
	$(BB) contract_ultra_honk -o $(CONTRACT)

clean:
	rm -f $(PROOF) $(VK) $(CONTRACT)
