"use client";

import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getAllUniqueColors } from "@/lib/numerology/engine/color-engine";
import {
  oldVehicleFormSchema,
  type OldVehicleFormValues,
} from "@/lib/validation/vehicleForms";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const ANALYZE_ITEMS = [
  "Vehicle Number Compatibility",
  "Vehicle Color Compatibility",
  "Purchase Date Alignment",
  "Hidden Energy Conflicts",
  "Personalized Numerology Remedies",
  "AI-Powered Recommendations",
];

const OldVehicleInsightsForm = ({
  onSubmit,
}: {
  onSubmit: (data: OldVehicleFormValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OldVehicleFormValues>({
    resolver: zodResolver(oldVehicleFormSchema),
    defaultValues: {
      dob: "",
      vehicleRegNumber: "",
      vehicleColor: "",
      purchaseDate: "",
    },
  });

  const VEHICLE_COLORS = getAllUniqueColors();

  useEffect(() => {
    axios
      .get("/api/profile")
      .then(({ data }) => {
        if (data.success && data.dob) {
          setValue("dob", dayjs(data.dob).format("YYYY-MM-DD"));
        }
      })
      .catch(() => {
        /* silently ignore */
      });
  }, [setValue]);

  const { onChange: onVehicleRegNumberChange, ...vehicleRegNumberField } =
    register("vehicleRegNumber");

  return (
    <div>
      {/* Heading */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mb-8"
      >
        <motion.h1 variants={fadeUp} className="font-headline text-2xl font-semibold text-on-surface mb-2">
          Old Vehicle Analysis
        </motion.h1>
        <motion.p variants={fadeUp} className="font-body text-xs text-on-surface-variant">
          Check whether your current vehicle aligns with your numerology profile
          and discover personalized remedies.
        </motion.p>
      </motion.section>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Form Card */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="glass-card rounded-lg p-6 mb-4"
        >
          <div className="space-y-6">
            {/* DOB */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-[12px] font-bold tracking-[0.05em] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]!">
                  calendar_today
                </span>
                YOUR DATE OF BIRTH
              </label>
              <div className="border border-white/5 bg-surface-container-lowest rounded-lg flex items-center px-4 h-14 transition-all focus-within:border-primary-container focus-within:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <input
                  type="date"
                  {...register("dob")}
                  className="bg-transparent border-none outline-none text-on-surface text-base w-full [color-scheme:dark]"
                />
              </div>
              {errors.dob && (
                <p className="text-[12px] text-error mt-1">
                  {errors.dob.message}
                </p>
              )}
            </motion.div>

            {/* Registration Number */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-[12px] font-bold tracking-[0.05em] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]!">
                  directions_car
                </span>
                VEHICLE REGISTRATION NUMBER
              </label>
              <div className="border border-white/5 bg-surface-container-lowest rounded-lg flex items-center px-4 h-14 transition-all focus-within:border-primary-container focus-within:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <input
                  type="text"
                  placeholder="AS01GP7597"
                  {...vehicleRegNumberField}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    onVehicleRegNumberChange(e);
                  }}
                  className="bg-transparent border-none outline-none text-primary font-numeral text-xl tracking-widest uppercase w-full placeholder:text-outline/30"
                />
              </div>
              <p className="text-[12px] text-outline flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]!">
                  info
                </span>
                We automatically calculate the vehicle vibration number.
              </p>
              {errors.vehicleRegNumber && (
                <p className="text-[12px] text-error mt-1">
                  {errors.vehicleRegNumber.message}
                </p>
              )}
            </motion.div>

            {/* Vehicle Color */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-[12px] font-bold tracking-[0.05em] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]!">
                  palette
                </span>
                CURRENT VEHICLE COLOR
              </label>
              <Controller
                control={control}
                name="vehicleColor"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-14! rounded-lg border border-white/5 bg-surface-container-lowest px-4 text-on-surface text-base focus:border-primary-container focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:ring-0 data-[state=open]:border-primary-container">
                      <SelectValue
                        placeholder={
                          <span className="text-outline/50">
                            Select color
                          </span>
                        }
                      >
                        {(() => {
                          const found = VEHICLE_COLORS.find(
                            (c) => c.color === field.value,
                          );
                          if (!found) return null;
                          return (
                            <span className="flex items-center gap-3">
                              <span
                                className="inline-block w-5 h-5 rounded-full border border-white/20 shrink-0"
                                style={{ backgroundColor: found.hex }}
                              />
                              <span>{found.color}</span>
                            </span>
                          );
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-surface-container-high border border-white/10 rounded-lg">
                      {VEHICLE_COLORS.map(({ color, hex }) => (
                        <SelectItem
                          key={color}
                          value={color}
                          className="text-on-surface py-2 hover:bg-white/5 focus:bg-white/5 cursor-pointer rounded-lg"
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className="inline-block w-5 h-5 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span>{color}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehicleColor && (
                <p className="text-[12px] text-error mt-1">
                  {errors.vehicleColor.message}
                </p>
              )}
            </motion.div>

            {/* Purchase Date */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-[12px] font-bold tracking-[0.05em] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]!">
                  event
                </span>
                VEHICLE PURCHASE DATE
              </label>
              <div className="border border-white/5 bg-surface-container-lowest rounded-lg flex items-center px-4 h-14 transition-all focus-within:border-primary-container focus-within:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <input
                  type="date"
                  {...register("purchaseDate")}
                  className="bg-transparent border-none outline-none text-on-surface text-base w-full [color-scheme:dark]"
                />
              </div>
              <p className="text-[12px] text-outline mt-1">
                Used to evaluate the purchase timing vibration.
              </p>
              {errors.purchaseDate && (
                <p className="text-[12px] text-error mt-1">
                  {errors.purchaseDate.message}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="glass-card rounded-lg p-5 border border-primary/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_1]">
              auto_awesome
            </span>
            <span className="text-[12px] font-bold tracking-[0.05em] text-on-surface">
              WE WILL ANALYZE
            </span>
          </div>
          <ul className="space-y-3">
            {ANALYZE_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-primary text-[18px]! [font-variation-settings:'FILL'_1]">
                  check_circle
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="flex justify-around items-center mt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full cursor-pointer bg-primary py-4 px-2 rounded-xl font-headline text-[14px] font-semibold text-on-primary flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(242,202,80,0.3)]"
          >
            <span className="material-symbols-outlined">
              temp_preferences_custom
            </span>
            Analyze My Vehicle
          </motion.button>
        </div>

        <div className="flex justify-around items-center mt-6">
          <div className="flex flex-col items-center gap-1 opacity-60">
            <span className="material-symbols-outlined text-[16px] text-primary">
              verified_user
            </span>
            <span className="text-[10px] font-bold tracking-[0.05em] text-on-surface-variant">
              SECURE ANALYSIS
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-60">
            <span className="material-symbols-outlined text-[16px] text-primary">
              timer
            </span>
            <span className="text-[10px] font-bold tracking-[0.05em] text-on-surface-variant">
              INSTANT RESULTS
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-60">
            <span className="material-symbols-outlined text-[16px] text-primary">
              psychology
            </span>
            <span className="text-[10px] font-bold tracking-[0.05em] text-on-surface-variant">
              AI POWERED
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OldVehicleInsightsForm;
