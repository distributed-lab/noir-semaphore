# Default scheme if not provided on command line
SCHEME ?= ultra_honk

# Common directories/files
BUILD_DIR        = ./target
SEMAPHORE_JSON   = $(BUILD_DIR)/semaphore.json
SEMAPHORE_GZ     = $(BUILD_DIR)/semaphore.gz
PROOF            = $(BUILD_DIR)/proof
VK               = $(BUILD_DIR)/vk
CONTRACT 		 = $(BUILD_DIR)/Verifier.sol

.PHONY: prove vk verify gates clean

prove:
	bb prove --scheme $(SCHEME) \
	         -b $(SEMAPHORE_JSON) \
	         -w $(SEMAPHORE_GZ) \
	         -o $(PROOF)

vk:
	bb write_vk --scheme $(SCHEME) \
	            -b $(SEMAPHORE_JSON) \
	            -o $(VK)

verify: prove vk
	bb verify --scheme $(SCHEME) \
	          -k $(VK) \
	          -p $(PROOF)

gates:
	bb gates --scheme $(SCHEME) \
	         -b $(SEMAPHORE_JSON)

contract_plonk:
	bb contract -o $(CONTRACT)

contract_honk:
	bb contract_ultra_honk -o $(CONTRACT)

clean:
	rm -f $(PROOF) $(VK) $(CONTRACT)
